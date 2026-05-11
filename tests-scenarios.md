# Test Scenarios — AutomationExercise

## Testing Approach

This project uses a two-layer testing strategy covering both the backend (.NET) and frontend (Angular).

### Backend — xUnit (C#)

**Project:** `AutomationExercise.Tests`  
**Framework:** xUnit  
**Strategy:** Unit tests targeting business logic that is decoupled from the database.  
The `JwtService` was extracted from `AuthController` via an `IJwtService` interface specifically to make token generation independently testable through Dependency Injection. The `IConfiguration` dependency is replaced with an in-memory configuration dictionary during tests — no real database or HTTP server is required.

**Test files:**
- `Services/JwtServiceTests.cs` — JWT token generation logic
- `Models/ProductModelTests.cs` — Domain model integrity

**Run with:**
```bash
dotnet test AutomationExercise.Tests/AutomationExercise.Tests.csproj
```

---

### Frontend — Jasmine / Karma (Angular)

**Framework:** Jasmine + Karma  
**Strategy:** Unit tests targeting pure service logic (no HTTP calls, no DOM). `BehaviorSubject`-based state in `CartService` emits synchronously, making it straightforward to assert state changes inline. `AuthService` is tested by controlling `localStorage` directly — the real browser API is available in the Karma test environment.

**Test files:**
- `src/app/services/cart.spec.ts` — Cart state management
- `src/app/services/auth.spec.ts` — Authentication state and token management

**Run with:**
```bash
ng test --watch=false
```

---

## Test Scenarios

---

### Feature: JWT Token Generation

---

**Scenario: Token is generated and returned as a non-empty string**
```gherkin
Given a JwtService configured with a valid secret key, issuer and audience
When CreateToken is called with a username
Then the returned value is not null
And the returned value is not an empty string
```

---

**Scenario: Token contains the correct username as a claim**
```gherkin
Given a JwtService configured with a valid secret key
When CreateToken is called with the username "testuser"
Then the decoded JWT claims contain a claim whose value equals "testuser"
```

---

**Scenario: Token expires in approximately one hour**
```gherkin
Given a JwtService configured with a valid secret key
When CreateToken is called at a known point in time
Then the decoded JWT expiry (ValidTo) is greater than 59 minutes from now
And the decoded JWT expiry (ValidTo) is less than 61 minutes from now
```

---

**Scenario: Different usernames produce different tokens**
```gherkin
Given a JwtService configured with a valid secret key
When CreateToken is called with username "alice"
And CreateToken is called with username "bob"
Then the two tokens are not equal to each other
```

---

**Scenario: Generated token is a structurally valid JWT**
```gherkin
Given a JwtService configured with a valid secret key
When CreateToken is called with any username
Then the JwtSecurityTokenHandler can read the token without throwing an exception
```

---

### Feature: Product Domain Model

---

**Scenario: Product initialises with correct default values**
```gherkin
Given a new Product object is created with no arguments
Then ProductID equals 0
And Name equals an empty string
And Description equals an empty string
And Price equals 0
And ImageUrl equals an empty string
And ImagePosition equals "center"
```

---

**Scenario: All product properties can be set and read back**
```gherkin
Given a Product object is created with all properties assigned
When the property values are read back
Then ProductID returns the assigned integer
And Name returns the assigned string
And Description returns the assigned string
And Price returns the assigned decimal value
And ImageUrl returns the assigned URL string
And ImagePosition returns the assigned position string
```

---

**Scenario: Product price supports decimal precision**
```gherkin
Given a Product with Price set to 9.99
When the Price property is read
Then the value equals exactly 9.99 with decimal precision preserved
```

---

**Scenario: Product name can be updated after initial assignment**
```gherkin
Given a Product with Name set to "Old Name"
When the Name property is updated to "New Name"
Then reading Name returns "New Name"
```

---

### Feature: Cart State Management

---

**Scenario: Cart service is available via dependency injection**
```gherkin
Given the Angular TestBed is configured
When the Cart service is injected
Then the service instance is truthy
```

---

**Scenario: Adding a new item to an empty cart**
```gherkin
Given the cart is empty
When a new CartItem with productId 1 and name "Wireless Mouse" is added
Then the cart contains exactly 1 item
And the item name is "Wireless Mouse"
```

---

**Scenario: Adding an existing item increments its quantity**
```gherkin
Given the cart is empty
And a CartItem with productId 1 and quantity 1 has been added
When the same CartItem with productId 1 and quantity 1 is added again
Then the cart still contains exactly 1 item
And the item quantity is 2
```

---

**Scenario: Adding two different products creates two separate entries**
```gherkin
Given the cart is empty
When a CartItem with productId 1 is added
And a CartItem with productId 2 is added
Then the cart contains exactly 2 items
```

---

**Scenario: Removing an item by productId**
```gherkin
Given the cart contains a CartItem with productId 1
When removeFromCart is called with productId 1
Then the cart is empty
```

---

**Scenario: Removing a non-existent productId does not affect the cart**
```gherkin
Given the cart contains a CartItem with productId 1
When removeFromCart is called with productId 999
Then the cart still contains exactly 1 item
```

---

**Scenario: Clearing the cart removes all items**
```gherkin
Given the cart contains items with productId 1 and productId 2
When clearCart is called
Then the cart is empty
```

---

**Scenario: Total price is calculated correctly**
```gherkin
Given the cart contains a CartItem with price 25.00 and quantity 2
And the cart contains a CartItem with price 90.00 and quantity 1
When the total is computed as the sum of price × quantity for all items
Then the total equals 140.00
```

---

**Scenario: Cart emits updated state after each mutating operation**
```gherkin
Given a subscription is attached to the cart observable
When an item with productId 1 is added
And an item with productId 2 is added
And the item with productId 1 is removed
Then the sequence of emitted cart lengths is [0, 1, 2, 1]
```

---

### Feature: Authentication State Management

---

**Scenario: Auth service is available via dependency injection**
```gherkin
Given the Angular TestBed is configured with HttpClient providers
When the Auth service is injected
Then the service instance is truthy
```

---

**Scenario: isLoggedIn returns false when no token is stored**
```gherkin
Given localStorage contains no "authToken" entry
When isLoggedIn is called
Then the result is false
```

---

**Scenario: isLoggedIn returns true after a token is saved**
```gherkin
Given localStorage is empty
When saveToken is called with a JWT string
Then isLoggedIn returns true
```

---

**Scenario: A saved token can be retrieved**
```gherkin
Given localStorage is empty
When saveToken is called with the value "my-jwt-token"
Then getToken returns "my-jwt-token"
```

---

**Scenario: getToken returns null when no token has been saved**
```gherkin
Given localStorage contains no "authToken" entry
When getToken is called
Then the result is null
```

---

**Scenario: Logout removes the token from storage**
```gherkin
Given a token has been saved via saveToken
When logout is called
Then getToken returns null
```

---

**Scenario: isLoggedIn returns false after logout**
```gherkin
Given a token has been saved via saveToken
When logout is called
Then isLoggedIn returns false
```

---

**Scenario: A saved userId can be retrieved**
```gherkin
Given localStorage is empty
When saveUserId is called with the value 42
Then getUserId returns 42
```

---

**Scenario: getUserId returns 0 when no userId has been saved**
```gherkin
Given localStorage contains no "userId" entry
When getUserId is called
Then the result is 0
```

---

**Scenario: Logout removes the userId from storage**
```gherkin
Given a userId has been saved via saveUserId with value 42
When logout is called
Then getUserId returns 0
```
