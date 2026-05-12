# Unit Tests

## Frontend (Angular — Vitest) — 46 tests

---

### `app.spec.ts`

**should create the app**

- **Given** the App component is configured in TestBed
- **When** the component is created
- **Then** it should be truthy

**should render the navbar brand**

- **Given** the App component is rendered
- **When** the DOM is inspected
- **Then** the `.navbar-brand` element should contain the text "Automation Exercise"

---

### `services/auth.spec.ts`

**should be created**

- **Given** the Auth service is provided via TestBed
- **When** it is injected
- **Then** the service instance should be truthy

**should return false for isLoggedIn when no token is stored**

- **Given** localStorage is empty
- **When** `isLoggedIn()` is called
- **Then** it should return `false`

**should return true for isLoggedIn after saving a token**

- **Given** a token has been saved via `saveToken()`
- **When** `isLoggedIn()` is called
- **Then** it should return `true`

**should save and retrieve a token**

- **Given** a token string is saved via `saveToken()`
- **When** `getToken()` is called
- **Then** it should return the same token string

**should return null for getToken when no token is stored**

- **Given** localStorage is empty
- **When** `getToken()` is called
- **Then** it should return `null`

**should remove token from storage on logout**

- **Given** a token has been saved
- **When** `logout()` is called
- **Then** `getToken()` should return `null`

**should set isLoggedIn to false after logout**

- **Given** a token has been saved
- **When** `logout()` is called
- **Then** `isLoggedIn()` should return `false`

**should save and retrieve userId**

- **Given** a userId is saved via `saveUserId(42)`
- **When** `getUserId()` is called
- **Then** it should return `42`

**should return 0 for getUserId when nothing is stored**

- **Given** localStorage is empty
- **When** `getUserId()` is called
- **Then** it should return `0`

**should remove userId on logout**

- **Given** a userId has been saved
- **When** `logout()` is called
- **Then** `getUserId()` should return `0`

**should save and load profile from localStorage**

- **Given** a profile object is saved via `saveProfile()`
- **When** `loadProfile()` is called
- **Then** it should return the same profile object

**should return null when no profile is stored**

- **Given** localStorage is empty
- **When** `loadProfile()` is called
- **Then** it should return `null`

**should remove profile from localStorage on logout**

- **Given** a profile has been saved
- **When** `logout()` is called
- **Then** `loadProfile()` should return `null`

**should return true for isTokenExpired when no token is stored**

- **Given** localStorage is empty
- **When** `isTokenExpired()` is called
- **Then** it should return `true`

**should return true for isTokenExpired when token is expired**

- **Given** a JWT token with an `exp` value in the past is stored
- **When** `isTokenExpired()` is called
- **Then** it should return `true`

**should return false for isTokenExpired when token is still valid**

- **Given** a JWT token with an `exp` value 1 hour in the future is stored
- **When** `isTokenExpired()` is called
- **Then** it should return `false`

---

### `services/cart.spec.ts`

**should be created**

- **Given** the Cart service is provided via TestBed
- **When** it is injected
- **Then** the service instance should be truthy

**should add a new item to the cart**

- **Given** the cart is empty
- **When** a new item is added via `addToCart()`
- **Then** `cart$` should emit an array with 1 item

**should increment quantity when adding an already existing item**

- **Given** the cart already contains a product with productId 1
- **When** the same product is added again via `addToCart()`
- **Then** the item's quantity should be 2 and the cart should still have 1 entry

**should keep separate entries for different products**

- **Given** the cart is empty
- **When** two items with different productIds are added
- **Then** `cart$` should emit an array with 2 items

**should remove an item from the cart by productId**

- **Given** the cart contains an item with productId 1
- **When** `removeFromCart(1)` is called
- **Then** `cart$` should emit an empty array

**should not affect cart when removing a productId that does not exist**

- **Given** the cart contains one item
- **When** `removeFromCart(999)` is called with a non-existent id
- **Then** `cart$` should still emit an array with 1 item

**should clear all items from the cart**

- **Given** the cart contains multiple items
- **When** `clearCart()` is called
- **Then** `cart$` should emit an empty array

**should calculate total price correctly**

- **Given** the cart contains items with known prices and quantities
- **When** the total is computed as `price * quantity` summed
- **Then** the result should equal the expected total (e.g. 140.00)

**should emit updated cart after each operation**

- **Given** a subscription to `cart$`
- **When** two items are added and one is removed
- **Then** the emission sequence should be `[0, 1, 2, 1]`

**should increment item quantity with updateQuantity**

- **Given** the cart contains an item with quantity 1
- **When** `updateQuantity(id, 1)` is called
- **Then** the item's quantity should be 2

**should decrement item quantity with updateQuantity**

- **Given** the cart contains an item with quantity 3
- **When** `updateQuantity(id, -1)` is called
- **Then** the item's quantity should be 2

**should remove item when updateQuantity decrements to 0**

- **Given** the cart contains an item with quantity 1
- **When** `updateQuantity(id, -1)` is called
- **Then** the item should be removed from the cart

**should do nothing when updateQuantity is called with unknown productId**

- **Given** the cart contains an item with productId 1
- **When** `updateQuantity(999, -1)` is called
- **Then** the existing item's quantity should remain unchanged

---

### `services/product.spec.ts`

**should be created**

- **Given** the ProductService is provided via TestBed
- **When** it is injected
- **Then** the service instance should be truthy

---

### `components/login/login.spec.ts`

**should create**

- **Given** the Login component is configured in TestBed
- **When** the component is created
- **Then** it should be truthy

---

### `components/register/register.spec.ts`

**should create**

- **Given** the Register component is configured in TestBed
- **When** the component is created
- **Then** it should be truthy

**should set errorMessage for invalid email format**

- **Given** a username, password, and an invalid email (`not-an-email`) are set
- **When** `register()` is called
- **Then** `errorMessage` should be `"Please enter a valid email address."`

**should not set email error for valid email format**

- **Given** a valid email (`valid@email.com`) is set
- **When** `register()` is called
- **Then** `errorMessage` should not be `"Please enter a valid email address."`

**should set errorMessage for email missing @ symbol**

- **Given** an email without `@` (`invalidemail.com`) is set
- **When** `register()` is called
- **Then** `errorMessage` should be `"Please enter a valid email address."`

**should set errorMessage for email missing domain**

- **Given** an email with no domain after `@` (`user@`) is set
- **When** `register()` is called
- **Then** `errorMessage` should be `"Please enter a valid email address."`

---

### `components/cart/cart.spec.ts`

**should create**

- **Given** the Cart component is configured in TestBed
- **When** the component is created
- **Then** it should be truthy

---

### `components/checkout/checkout.spec.ts`

**should create**

- **Given** the Checkout component is configured in TestBed
- **When** the component is created
- **Then** it should be truthy

**should return 0 for totalPrice when cart is empty**

- **Given** the cart has been cleared
- **When** `totalPrice` is read
- **Then** it should be `0`

**should calculate totalPrice correctly from cart items**

- **Given** the cart contains items totalling 140.00 (2×25.00 + 1×90.00)
- **When** `totalPrice` is read
- **Then** it should be `140.00`

**should round totalPrice to 2 decimal places**

- **Given** the cart contains an item with price 0.1 and quantity 3
- **When** `totalPrice` is read
- **Then** it should be `0.30`

**should update totalPrice when cart changes**

- **Given** the cart initially contains one item worth 50.00
- **When** a second item worth 25.00 is added
- **Then** `totalPrice` should update from `50.00` to `75.00`

---

### `components/product-list/product-list.spec.ts`

**should create**

- **Given** the ProductList component is configured in TestBed
- **When** the component is created
- **Then** it should be truthy

---

### `interceptors/auth-interceptor.spec.ts`

**should be created**

- **Given** the `authInterceptor` function is defined
- **When** it is referenced in the test
- **Then** it should be truthy

---

## Backend (.NET — xUnit) — 21 tests

---

### `Models/ProductModelTests.cs`

**Product_DefaultValues_AreCorrect**

- **Given** a new `Product` instance is created with no properties set
- **When** its properties are read
- **Then** `ProductID` = 0, `Name` = `""`, `Description` = `""`, `Price` = 0, `ImageUrl` = `""`, `ImagePosition` = `"center"`, `Stock` = 0

**Product_CanSetAllProperties**

- **Given** a `Product` instance
- **When** all properties are assigned values
- **Then** each property should return the assigned value

**Product_Price_SupportsDecimalPrecision**

- **Given** a `Product` instance
- **When** `Price` is set to `9.99m`
- **Then** `Price` should equal `9.99m`

**Product_Name_CanBeUpdated**

- **Given** a `Product` with `Name = "Old Name"`
- **When** `Name` is reassigned to `"New Name"`
- **Then** `Name` should equal `"New Name"`

**Product_Stock_DefaultsToZero**

- **Given** a new `Product` instance with no properties set
- **When** `Stock` is read
- **Then** it should equal `0`

**Product_Stock_CanBeSet**

- **Given** a `Product` instance
- **When** `Stock` is set to `15`
- **Then** `Stock` should equal `15`

**Product_Stock_CanBeUpdated**

- **Given** a `Product` with `Stock = 10`
- **When** `Stock` is decremented by 3
- **Then** `Stock` should equal `7`

---

### `Models/OrderItemModelTests.cs`

**OrderItem_DefaultValues_AreCorrect**

- **Given** a new `OrderItem` instance is created with no properties set
- **When** its properties are read
- **Then** `OrderItemID` = 0, `ProductID` = 0, `OrderID` = 0, `Quantity` = 0, `UnitPrice` = 0, `ProductName` = `""`, `ImageUrl` = `""`

**OrderItem_CanSetAllProperties**

- **Given** an `OrderItem` instance
- **When** all properties are assigned values
- **Then** each property should return the assigned value

**OrderItem_UnitPrice_SupportsDecimalPrecision**

- **Given** an `OrderItem` instance
- **When** `UnitPrice` is set to `9.99m`
- **Then** `UnitPrice` should equal `9.99m`

**OrderItem_Subtotal_CalculatesCorrectly**

- **Given** an `OrderItem` with `UnitPrice = 25.99m` and `Quantity = 3`
- **When** `UnitPrice * Quantity` is computed
- **Then** the result should equal `77.97m`

---

### `Models/OrderModelTests.cs`

**Order_DefaultValues_AreCorrect**

- **Given** a new `Order` instance is created with no properties set
- **When** its properties are read
- **Then** `OrderID` = 0, `OrderNumber` = 0, `ShippingAddress` = `""`, `Mentions` = `null`, `OrderDate` = `null`, `TotalPrice` = 0, `UserID` = 0, `OrderItems` is an empty list

**Order_CanSetAllProperties**

- **Given** an `Order` instance
- **When** all properties are assigned values
- **Then** each property should return the assigned value

**Order_OrderItems_CanAddItems**

- **Given** a new `Order` instance
- **When** two `OrderItem` objects are added to `OrderItems`
- **Then** `OrderItems.Count` should equal `2`

**Order_TotalPrice_MatchesSumOfItems**

- **Given** an `Order` with two items (2×25.99 + 1×89.99)
- **When** `TotalPrice` is set to the computed sum
- **Then** `TotalPrice` should equal `141.97m`

**Order_Mentions_CanBeNull**

- **Given** an `Order` instance
- **When** `Mentions` is set to `null`
- **Then** `Mentions` should be `null`

---

### `Services/JwtServiceTests.cs`

**CreateToken_ReturnsNonEmptyString**

- **Given** the JwtService is configured with a valid key, issuer, and audience
- **When** `CreateToken("testuser")` is called
- **Then** the returned token should be a non-null, non-empty string

**CreateToken_ContainsCorrectUsername**

- **Given** the JwtService is configured
- **When** `CreateToken("testuser")` is called and the token is decoded
- **Then** the JWT claims should contain a claim with value `"testuser"`

**CreateToken_ExpiresInApproximatelyOneHour**

- **Given** the JwtService is configured
- **When** `CreateToken("testuser")` is called and the token is decoded
- **Then** `ValidTo` should be between 59 and 61 minutes from now

**CreateToken_DifferentUsernames_ProduceDifferentTokens**

- **Given** the JwtService is configured
- **When** tokens are created for `"alice"` and `"bob"`
- **Then** the two tokens should not be equal

**CreateToken_SameUsername_ProducesValidJwt**

- **Given** the JwtService is configured
- **When** `CreateToken("testuser")` is called
- **Then** `JwtSecurityTokenHandler.CanReadToken()` should return `true`
