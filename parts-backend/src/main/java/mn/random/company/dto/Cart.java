package mn.random.company.dto;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    private String cartId;
    private String userId;
    private final List<CartItem> items = new ArrayList<>();

    public Cart(String cartId, String userId) {
        this.cartId = cartId;
        this.userId = userId;
    }

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
