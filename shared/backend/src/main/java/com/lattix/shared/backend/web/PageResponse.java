package com.lattix.shared.backend.web;

import java.util.List;

public class PageResponse<T> {
    private List<T> items;
    private long totalElements;
    private int totalPages;
    private int pageNumber;
    private int pageSize;

    public PageResponse() {
    }

    public PageResponse(List<T> items, long totalElements, int totalPages, int pageNumber, int pageSize) {
        this.items = items;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    public List<T> getItems() {
        return items;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }
}
