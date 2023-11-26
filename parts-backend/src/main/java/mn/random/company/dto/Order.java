package mn.random.company.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Order {
    private String orderId;
    private String userId;
    private String state;
    private LocalDateTime createDate;
    private LocalDateTime deliveryDate;
    private final List<OrderItem> items = new ArrayList<>();

    public Order(String orderId, String userId, String state, Timestamp createTimestamp, Timestamp deliveryTimestamp) {
        this.orderId = orderId;
        this.userId = userId;
        this.state = state;
        this.createDate = createTimestamp.toLocalDateTime();
        if(deliveryTimestamp == null) {
            this.deliveryDate = null;
        } else {
            this.deliveryDate = deliveryTimestamp.toLocalDateTime();
        }
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

    public void addOrderItem(OrderItem item) {
        items.add(item);
    }

    public List<OrderItem> getItems() {
        return items;
    }
}
