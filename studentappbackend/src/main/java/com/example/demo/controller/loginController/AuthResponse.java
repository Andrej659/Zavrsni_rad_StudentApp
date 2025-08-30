package com.example.demo.controller.loginController;

class AuthResponse {
    private String token;
    private Integer role;

    public AuthResponse(String token, Integer role) {
        this.token = token;
        this.role = role;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }
}
