This is a React Native project, bootstrapped using `@react-native-community/cli`.

**Project Overview**

> [!IMPORTANT] > **Platform Disclaimer**: This project has been developed and tested exclusively on **Android**. While it may run on iOS, compatibility and functionality are not guaranteed.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

# Technical Choices & Rationale

This project employs several specific technical approaches:

- **Styling**: Instead of using a component library, styling is handled via a custom utility function (`src/utils/style.util.ts`). This utility generates atomic CSS-like style objects inspired by Tailwind CSS, allowing for consistent and reusable styling directly within components using familiar class-like syntax (e.g., `atoms.flex_row`, `atoms.p_md`, `themeAtoms.bg_primary`). This approach was chosen to keep dependencies minimal while providing a developer-friendly styling experience.
- **State Management**: Global state management is kept simple, primarily using React's built-in Context API. Currently, this is used for managing the application's theme (`src/store/theme.store.ts`). This was deemed sufficient for the project's current scope, avoiding the complexity of larger state management libraries like Redux or Zustand.
- **Navigation**: Navigation is implemented using [React Navigation](https://reactnavigation.org/), specifically employing a static navigation structure. This library was chosen as it is the de-facto standard for navigation in the React Native ecosystem, offering robust features and strong community support.
- **Architecture (Screens)**: Screens are structured following the **Model-View-ViewModel (MVVM)** pattern. Each screen typically consists of:
  - A **View** (`*.view.tsx`): A React component responsible solely for rendering the UI based on data provided by the ViewModel.
  - A **ViewModel** (`*.view-model.ts`): A custom React hook that fetches data (interacting with the Model layer, often services/repositories), manages the screen's state, handles user input, and exposes formatted data and actions to the View. This keeps the View components lean and separates UI logic from presentation.
  - Optional supporting **Hooks** (e.g., within a `hooks/` subdirectory): Further breaking down complex logic within the ViewModel.
- **Data Fetching**:
  - A custom `HttpService` (`src/services/http/http.service.ts`) wraps the native `fetch` API. It provides standardized methods (GET, POST, PUT, DELETE) and includes a basic in-memory, time-to-live (TTL) caching mechanism specifically for GET requests to reduce redundant network calls. A singleton instance is exported for global use.
  - An `ApiService` (`src/services/api/api.service.ts`) coordinates interactions with the backend. It utilizes a **Repository Pattern**, where specific repositories (e.g., `src/services/api/repositories/frontend-test/frontend-test.repository.ts`) encapsulate the logic for fetching and manipulating data related to a particular domain. These repositories are instantiated with the `HttpService` and the relevant base URL, promoting separation of concerns and making API logic more organized and testable.

# Performance Optimizations

The following performance optimization strategies are employed, particularly within the reusable components (`src/components`):

- **Memoization**: Components frequently used in lists or likely to receive the same props repeatedly (e.g., `TransactionItem`) are wrapped in `React.memo`. This prevents unnecessary re-renders when parent components update but the props passed to the memoized child remain the same.
- **Callback Memoization**: Functions passed as props (like `onPress` handlers) are often memoized using `useCallback` (e.g., in `TransactionItem`). This ensures that the function reference doesn't change on every render, complementing `React.memo` by preventing re-renders caused solely by unchanged callback props.
- **Virtualized Lists**: For rendering lists of data (e.g., `TransactionList`), React Native's `FlatList` component is used instead of mapping over an array within a `ScrollView`. `FlatList` provides virtualization, rendering only the items currently visible or near the viewport, which dramatically improves performance and memory usage for long lists.
