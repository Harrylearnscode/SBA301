package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.response.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseObject> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // Log lỗi ra console để debug
        ResponseObject response = ResponseObject.builder()
                .code("400")
                .message(ex.getMessage())
                .isSuccess(false)
                .status(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject> handleGlobalException(Exception ex) {
        ex.printStackTrace(); // Log lỗi ra console để debug
        ResponseObject response = ResponseObject.builder()
                .code("500")
                .message("Lỗi hệ thống: " + ex.getMessage())
                .isSuccess(false)
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
