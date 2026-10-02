package com.sumit.bookstore.controller;

import com.sumit.bookstore.payload.dto.WishlistDTO;
import com.sumit.bookstore.payload.response.ApiResponse;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.service.IWishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final IWishlistService wishlistService;


    @PostMapping("/add/{bookId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long bookId,
            @RequestParam(required = false) String notes) throws Exception {

        WishlistDTO wishlistDTO = wishlistService.addToWishlist(bookId, notes);
        return ResponseEntity.ok(wishlistDTO);
    }


    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<ApiResponse> removeFromWishlist(
            @PathVariable Long bookId) throws Exception {

        wishlistService.removeFromWishlist(bookId);
        return ResponseEntity.ok(new ApiResponse(
                        "Book removed from wishlist successfully",
                        true));
    }


    @GetMapping("/my-wishlist")
    public ResponseEntity<?> getMyWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws Exception {

        PageResponse<WishlistDTO> wishlist = wishlistService.getMyWishlist(page, size);
        return ResponseEntity.ok(wishlist);
    }
}
