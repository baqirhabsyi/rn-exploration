import {
  StaticParamList,
  createStaticNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TransactionDetailView from '../screens/transaction-detail/transaction-detail.view';
import TransactionListView from '../screens/transaction-list/transaction-list.view';

/**
 * Defines the main navigation stack for the application using React Navigation Native Stack.
 * Sets the initial route and configures screen options.
 */
const RootStack = createNativeStackNavigator({
  // Sets the default screen to display when the app loads.
  initialRouteName: 'TransactionList',
  // Hides the default header for all screens in this stack.
  screenOptions: {
    headerShown: false,
  },
  // Defines the screens available in this navigation stack.
  screens: {
    TransactionList: TransactionListView,
    TransactionDetail: TransactionDetailView,
  },
});

// Extracts the param list type from the RootStack navigator.
type RootStackParamList = StaticParamList<typeof RootStack>;

// Extends the global ReactNavigation namespace to include our RootStackParamList.
// This provides type safety for navigation actions throughout the app.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Creates a static navigation component based on the defined RootStack.
// Static navigation pre-defines the navigation structure for improved performance.
const Navigation = createStaticNavigation(RootStack);

// Exports the configured Navigation component for use in the main App component.
export default Navigation;
