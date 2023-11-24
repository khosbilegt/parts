package mn.random.company.dto;

import io.vertx.core.json.JsonObject;

public class Product {
    private String productID;
    private String productName;
    private String sellerID;
    private String description;
    private String category;
    private String manufacturer;
    private int price;
    private int stock;

    public Product(String productID, String sellerID, String productName, String description, String category, String manufacturer, int price, int stock) {
        this.productID = productID;
        this.productName = productName;
        this.sellerID = sellerID;
        this.description = description;
        this.category = category;
        this.manufacturer = manufacturer;
        this.price = price;
        this.stock = stock;
    }

    public Product(JsonObject jsonObject, String sellerID) {
        this.productID = "";
        this.sellerID = sellerID;
        this.productName = jsonObject.getString("productName");
        this.description = jsonObject.getString("description");
        this.category = jsonObject.getString("category");
        this.manufacturer = jsonObject.getString("manufacturer");
        this.price = jsonObject.getInteger("price");
        this.stock = jsonObject.getInteger("stock");
    }

    public String getProductID() {
        return productID;
    }

    public void setProductID(String productID) {
        this.productID = productID;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSellerID() {
        return sellerID;
    }

    public void setSellerID(String sellerID) {
        this.sellerID = sellerID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}