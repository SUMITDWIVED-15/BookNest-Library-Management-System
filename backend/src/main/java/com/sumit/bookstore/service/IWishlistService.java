package com.sumit.bookstore.service;

import com.sumit.bookstore.payload.dto.WishlistDTO;
import com.sumit.bookstore.payload.response.PageResponse;

public interface IWishlistService {

    WishlistDTO addToWishlist(Long bookId, String notes) throws Exception;

    void removeFromWishlist(Long bookId) throws Exception;

    PageResponse<WishlistDTO> getMyWishlist(int page, int size) throws Exception;
}