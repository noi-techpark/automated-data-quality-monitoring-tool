# ODHDataChecker

This TypeScript application is designed to validate data from the Open Data Hub using a set of predefined rules. 📊

## Index

- [Usage](#usage)
- [Rules](#rules)
- [Authentication](#authentication)
- [License](#license)

## Usage

The ODHDataChecker can be run natively or as a Docker container (recommended).

### Native Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory with the following content:
   ```bash
   cp .env.example .env
   ```
3. Configure the `.env` file.
4. Run the application:
   ```bash
   npm run start
   ```

### Docker Usage (Recommended)

1. Create a `.env` file in the root directory with the following content:
   ```bash
   cp .env.example .env
   ```
2. Configure the `.env` file.
3. Use Docker Compose to build and run the application:
   ```bash
   docker-compose up --build
   ```
   Note: This setup will start a local PostgreSQL database using the default credentials from the `.env.example` file, which are intended for development only. For production use, you should connect to your own PostgreSQL database and update the credentials in your `.env` file accordingly.

## Rules

The ODHDataChecker validates data using a flexible rule system. Each rule specifies a `search filter`, a `type`, and a `value`, and is evaluated against data.

### Search Filter

The search filter is a wildcard pattern that matches keys in the data. If the key matches the pattern, the rule is applied to the corresponding data. This can be useful for running rules on specific keys or groups of keys in the data.

### Rule Types

#### 1. `matches-wildcard`

Checks if the string representation of a value matches a wildcard pattern.

- **How it works:** If the value matches the pattern, the rule passes; otherwise, it fails.

#### 2. `null-check`

Checks for null values according to the rule's `value`:

- **`no-null`:** Fails if the value is `null`.
- **`only-null`:** Passes if the value is `null`.

#### 3. `math-check`

Performs a mathematical comparison between the value and a number.

- **Supported operators:** `>`, `<`, `>=`, `<=`, `==`, `=`, `!=`, `!`
- **How it works:** Only applies if the value is a number. The rule passes if the comparison is true.

#### 4. `javascript`

Executes user-defined JavaScript code in a secure, isolated environment for each data item being validated. The value for this type of rule is a string containing JavaScript code that will be executed.

- **Helpers available in code:**

  - `log(...)` — Log output, useful for debugging single rules
  - `getKey()` — Get the current key
  - `getKeyValue()` — Get the current value
  - `getKeyPath()` — Get the path to the key
  - `getValueType()` — Get the value's type

  You can use helpers to access the key, value, and other context information that is being tested at a certain point in time by the app.

- **How it works:** If the code returns a truthy value, the rule passes; otherwise, it fails. If execution throws an error, the rule fails with an error message.

## Authentication

If you need to access data that requires authentication, you can provide Keycloak credentials in the .env file. The application will use these credentials to authenticate with Keycloak and will use the resulting access token to access the data.

If you wish to disable Keycloak authentication, make sure the `KEYCLOAK_CLIENT_SECRET` environment variable is set to an empty string in the `.env` file. This will disable Keycloak authentication, allowing the application to run without it.

## License

This project is licensed under the GNU Affero General Public License v3.0.
See [LICENSE](./LICENSE) for details.
