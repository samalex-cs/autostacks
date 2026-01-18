package com.app.backend.exceptions;

public class FirestoreOperationException extends RuntimeException {
    
    public FirestoreOperationException(String message) {
        super(message);
    }
    
    public FirestoreOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}

