package mn.random.company.dto;

import java.time.LocalDateTime;

public class Order {
    private String orderId;
    private String userId;
    private String state;
    private LocalDateTime createDate;
    private LocalDateTime deliveryDate;

    public Order(String orderId, String userId, String state, LocalDateTime createDate, LocalDateTime deliveryDate) {
        this.orderId = orderId;
        this.userId = userId;
        this.state = state;
        this.createDate = createDate;
        this.deliveryDate = deliveryDate;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public LocalDateTime getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
}
