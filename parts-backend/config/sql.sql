CREATE TABLE Users (
    UserID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(100) UNIQUE,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    `Password` VARCHAR(100),
    PhoneNumber VARCHAR(10),
    Address VARCHAR(100),
    PRIMARY KEY(UserID)
);

CREATE TABLE Products(
    ProductID INT NOT NULL AUTO_INCREMENT,
    Seller INT NOT NULL,
    ProductName VARCHAR(100),
    DESCRIPTION VARCHAR(255),
    Category VARCHAR(255),
    Manufacturer VARCHAR(255),
    Price INT,
    Stock INT,
    PRIMARY KEY(ProductID),
    FOREIGN KEY(Seller) REFERENCES Users(UserID)
);


CREATE TABLE Orders(
    OrderID INT NOT NULL AUTO_INCREMENT,
    UserID INT NOT NULL,
    State VARCHAR(20),
    CreateDate TIMESTAMP,
    DeliverDate TIMESTAMP,
    PRIMARY KEY(OrderID),
    FOREIGN KEY(UserID) REFERENCES Users(UserID),
    FOREIGN KEY(SellerID) REFERENCES Users(UserID)
);

CREATE TABLE OrderItem(
    OrderItemID INT NOT NULL AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY(OrderItemID),
    FOREIGN KEY(OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY(ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Carts(
    CartID INT NOT NULL AUTO_INCREMENT,
    UserID INT NOT NULL,
    PRIMARY KEY(CartID),
    FOREIGN KEY(UserID) REFERENCES Users(UserID)
);

CREATE TABLE CartItems(
    CartItemID INT NOT NULL AUTO_INCREMENT,
    CartID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY(CartItemID),
    FOREIGN KEY(CartID) REFERENCES Carts(CartID),
    FOREIGN KEY(ProductID) REFERENCES Products(ProductID)
);

ALTER TABLE CartItems
ADD CONSTRAINT UNIQUE_PRODUCT UNIQUE (CartID, ProductID);

INSERT INTO CartItems (CartID, ProductID, Quantity) 
VALUES (1, 2, 1) 
ON DUPLICATE KEY UPDATE Quantity = Quantity + 1

DELETE FROM CartItems
WHERE CartItemI = 5

SELECT * FROM CartItems


SELECT * FROM CartItems;