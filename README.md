# AutomationExercise

A fullstack e-commerce web application built with **Angular 21** (frontend) and **ASP.NET Core 10** (backend), using **SQL Server Express** as the database.

---

## Prerequisites

Make sure the following are installed before proceeding:

| Tool | Version | Download |
|------|---------|----------|
| .NET SDK | 10.0 | https://dotnet.microsoft.com/download |
| Node.js | 24.x | https://nodejs.org |
| npm | 11.x (comes with Node.js) | — |
| Angular CLI | 21.x | `npm install -g @angular/cli` |
| SQL Server Express | 2019 or 2022 | https://www.microsoft.com/en-us/sql-server/sql-server-downloads |
| SQL Server Management Studio (SSMS) | any | https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms |

---

## 1. Restore the Database

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your local instance: `.\SQLEXPRESS`
3. Right-click **Databases** → **Restore Database...**
4. Select **Device** → click `...` → **Add** → browse to `AutomationExercise.bak` in the root of this repository
5. Click **OK** to restore
6. Confirm the database name is `AutomationExercise` and click **OK**

> The restored database includes all tables (`Users`, `Products`, `Orders`, `OrderItems`) with sample product data and a default user account.

**Default user credentials:**
| Field | Value |
|-------|-------|
| Username | `user` |
| Email | `user@mail.com` |
| Password | `user123` |

---

## 2. Configure the Backend

The connection string is already set in `AutomationExercise.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=AutomationExercise;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

If your SQL Server instance name is different (e.g. `MSSQLSERVER` instead of `SQLEXPRESS`), update the `Server` value accordingly.

---

## 3. Run the .NET Backend

```bash
cd AutomationExercise.API
dotnet restore
dotnet run
```

The API will start at: **http://localhost:5279**

Swagger UI is available at: **http://localhost:5279/swagger**

---

## 4. Install Frontend Dependencies

```bash
cd AutomationExercise.UI
npm install
```

---

## 5. Start the Angular Frontend

```bash
cd AutomationExercise.UI
ng serve
```

The app will be available at: **http://localhost:4200**

> Make sure the backend is running before opening the frontend.

---

## 6. Run the Tests

**Frontend (Angular — Vitest):**
```bash
cd AutomationExercise.UI
ng test --watch=false
```

**Backend (.NET — xUnit):**
```bash
cd AutomationExercise.Tests
dotnet test
```

---

## Project Structure

```
AutomationExercise/
├── AutomationExercise.API/       # ASP.NET Core 10 REST API
│   ├── Controllers/              # AuthController, ProductsController, OrdersController
│   ├── Models/                   # Product, Order, OrderItem
│   ├── Services/                 # JwtService
│   └── appsettings.json          # Connection string & JWT config
├── AutomationExercise.UI/        # Angular 21 frontend
│   └── src/app/
│       ├── components/           # Login, Register, Cart, Checkout, ProductList, OrderList
│       ├── services/             # Auth, Cart, Product
│       └── interceptors/         # JWT auth interceptor
├── AutomationExercise.Tests/     # xUnit backend tests
└── AutomationExercise.bak        # SQL Server database backup
```

---

## Dependencies

### NuGet Packages — Backend (`AutomationExercise.API`)

Run from the `AutomationExercise.API/` directory:

| Package | Version | Install command |
|---------|---------|-----------------|
| BCrypt.Net-Next | 4.1.0 | `dotnet add package BCrypt.Net-Next --version 4.1.0` |
| Microsoft.AspNetCore.Authentication.JwtBearer | 10.0.7 | `dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.0.7` |
| Microsoft.AspNetCore.OpenApi | 10.0.5 | `dotnet add package Microsoft.AspNetCore.OpenApi --version 10.0.5` |
| Microsoft.Data.SqlClient | 7.0.0 | `dotnet add package Microsoft.Data.SqlClient --version 7.0.0` |
| Swashbuckle.AspNetCore | 10.1.7 | `dotnet add package Swashbuckle.AspNetCore --version 10.1.7` |

> Or simply run `dotnet restore` inside `AutomationExercise.API/` to restore all packages at once.

### NuGet Packages — Tests (`AutomationExercise.Tests`)

Run from the `AutomationExercise.Tests/` directory:

| Package | Version | Install command |
|---------|---------|-----------------|
| coverlet.collector | 6.0.4 | `dotnet add package coverlet.collector --version 6.0.4` |
| Microsoft.NET.Test.Sdk | 17.14.1 | `dotnet add package Microsoft.NET.Test.Sdk --version 17.14.1` |
| xunit | 2.9.3 | `dotnet add package xunit --version 2.9.3` |
| xunit.runner.visualstudio | 3.1.4 | `dotnet add package xunit.runner.visualstudio --version 3.1.4` |

> Or simply run `dotnet restore` inside `AutomationExercise.Tests/` to restore all packages at once.

### npm Packages — Frontend (`AutomationExercise.UI`)

Run from the `AutomationExercise.UI/` directory:

> Running `npm install` installs **all** packages below at once. The individual commands are listed for reference.

**Runtime dependencies:**

| Package | Version | Install command |
|---------|---------|-----------------|
| @angular/common | ^21.2.0 | `npm install @angular/common@^21.2.0` |
| @angular/compiler | ^21.2.0 | `npm install @angular/compiler@^21.2.0` |
| @angular/core | ^21.2.0 | `npm install @angular/core@^21.2.0` |
| @angular/forms | ^21.2.0 | `npm install @angular/forms@^21.2.0` |
| @angular/platform-browser | ^21.2.0 | `npm install @angular/platform-browser@^21.2.0` |
| @angular/router | ^21.2.0 | `npm install @angular/router@^21.2.0` |
| bootstrap | ^5.3.8 | `npm install bootstrap@^5.3.8` |
| rxjs | ~7.8.0 | `npm install rxjs@~7.8.0` |
| tslib | ^2.3.0 | `npm install tslib@^2.3.0` |
| zone.js | (transitive) | `npm install zone.js` — required at runtime, imported via `import 'zone.js'` in `main.ts`, installed automatically as a peer dependency of `@angular/core` |

**Dev dependencies:**

| Package | Version | Install command |
|---------|---------|-----------------|
| @angular/build | ^21.2.9 | `npm install --save-dev @angular/build@^21.2.9` |
| @angular/cli | ^21.2.9 | `npm install --save-dev @angular/cli@^21.2.9` |
| @angular/compiler-cli | ^21.2.0 | `npm install --save-dev @angular/compiler-cli@^21.2.0` |
| jsdom | ^28.0.0 | `npm install --save-dev jsdom@^28.0.0` |
| prettier | ^3.8.1 | `npm install --save-dev prettier@^3.8.1` |
| typescript | ~5.9.2 | `npm install --save-dev typescript@~5.9.2` |
| vitest | ^4.0.8 | `npm install --save-dev vitest@^4.0.8` |

---

## Unit Tests

### Frontend (Angular — Vitest) — 46 tests

**`app.spec.ts`**
- should create the app
- should render the navbar brand

**`services/auth.spec.ts`**
- should be created
- should return false for isLoggedIn when no token is stored
- should return true for isLoggedIn after saving a token
- should save and retrieve a token
- should return null for getToken when no token is stored
- should remove token from storage on logout
- should set isLoggedIn to false after logout
- should save and retrieve userId
- should return 0 for getUserId when nothing is stored
- should remove userId on logout
- should save and load profile from localStorage
- should return null when no profile is stored
- should remove profile from localStorage on logout
- should return true for isTokenExpired when no token is stored
- should return true for isTokenExpired when token is expired
- should return false for isTokenExpired when token is still valid

**`services/cart.spec.ts`**
- should be created
- should add a new item to the cart
- should increment quantity when adding an already existing item
- should keep separate entries for different products
- should remove an item from the cart by productId
- should not affect cart when removing a productId that does not exist
- should clear all items from the cart
- should calculate total price correctly
- should emit updated cart after each operation
- should increment item quantity with updateQuantity
- should decrement item quantity with updateQuantity
- should remove item when updateQuantity decrements to 0
- should do nothing when updateQuantity is called with unknown productId

**`services/product.spec.ts`**
- should be created

**`components/login/login.spec.ts`**
- should create

**`components/register/register.spec.ts`**
- should create
- should set errorMessage for invalid email format
- should not set email error for valid email format
- should set errorMessage for email missing @ symbol
- should set errorMessage for email missing domain

**`components/cart/cart.spec.ts`** (Cart component)
- should create

**`components/checkout/checkout.spec.ts`**
- should create
- should return 0 for totalPrice when cart is empty
- should calculate totalPrice correctly from cart items
- should round totalPrice to 2 decimal places
- should update totalPrice when cart changes

**`components/product-list/product-list.spec.ts`**
- should create

**`interceptors/auth-interceptor.spec.ts`**
- should be created

---

### Backend (.NET — xUnit) — 21 tests

**`Models/ProductModelTests.cs`**
- Product_DefaultValues_AreCorrect
- Product_CanSetAllProperties
- Product_Price_SupportsDecimalPrecision
- Product_Name_CanBeUpdated
- Product_Stock_DefaultsToZero
- Product_Stock_CanBeSet
- Product_Stock_CanBeUpdated

**`Models/OrderItemModelTests.cs`**
- OrderItem_DefaultValues_AreCorrect
- OrderItem_CanSetAllProperties
- OrderItem_UnitPrice_SupportsDecimalPrecision
- OrderItem_Subtotal_CalculatesCorrectly

**`Models/OrderModelTests.cs`**
- Order_DefaultValues_AreCorrect
- Order_CanSetAllProperties
- Order_OrderItems_CanAddItems
- Order_TotalPrice_MatchesSumOfItems
- Order_Mentions_CanBeNull

**`Services/JwtServiceTests.cs`**
- CreateToken_ReturnsNonEmptyString
- CreateToken_ContainsCorrectUsername
- CreateToken_ExpiresInApproximatelyOneHour
- CreateToken_DifferentUsernames_ProduceDifferentTokens
- CreateToken_SameUsername_ProducesValidJwt
