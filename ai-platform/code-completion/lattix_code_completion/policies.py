from __future__ import annotations

import re
from .models import CodeProposal, PolicyCheckResult


def enforce_generation_policy(proposal: CodeProposal) -> PolicyCheckResult:
    allowed = True
    violations = []
    warnings = []
    required_approval = False

    # Scan code content in each file of the proposal
    for file_proposal in proposal.files:
        path = file_proposal["path"]
        content = file_proposal["content"]

        # 1. Secrets check
        secret_match = re.search(r'(?:api[_-]?key|password|secret|token|private[_-]?key)\s*=\s*["\'][a-zA-Z0-9_\-]{8,}["\']', content, re.I)
        if secret_match:
            allowed = False
            violations.append(f"Secret detected in {path}: literal assignment to sensitive key name.")

        # 2. Destructive SQL check
        if path.endswith(".sql") or "sql" in path.lower():
            if re.search(r'drop\s+(?:table|database)\s+', content, re.I):
                allowed = False
                violations.append(f"Destructive operation detected in {path}: DROP TABLE or DROP DATABASE.")
            
            if re.search(r'delete\s+from\s+\w+', content, re.I) and not re.search(r'where\s+', content, re.I):
                allowed = False
                violations.append(f"Destructive operation detected in {path}: DELETE FROM without WHERE clause.")

        # 3. Boundary violations check
        # Rule: frontend cannot target services/agents/ai-platform
        if "frontend" in path.lower():
            if re.search(r'import\s+.*from\s+["\'](?:services|agents|ai-platform|terraform|kubernetes)', content, re.I):
                allowed = False
                violations.append(f"Boundary violation in {path}: Frontend importing backend or agent modules.")
                
        # Rule: services cannot target frontend/agents/ai-platform
        if "services" in path.lower() or "backend" in path.lower():
            if re.search(r'import\s+.*from\s+["\'](?:frontend|agents|ai-platform)', content, re.I):
                allowed = False
                violations.append(f"Boundary violation in {path}: Services importing frontend or agent modules.")

        # 4. Unsafe code patterns
        if re.search(r'\b(?:eval|exec)\b\s*\(', content):
            warnings.append(f"Unsafe execution pattern in {path}: eval() or exec() usage.")
            required_approval = True
            
        if re.search(r'\b(?:os\.system|subprocess\.Popen)\b', content):
            warnings.append(f"Unsafe process spawning in {path}: os.system or Popen execution.")
            required_approval = True

    return PolicyCheckResult(
        allowed=allowed,
        violations=violations,
        warnings=warnings,
        required_approval=required_approval,
    )
