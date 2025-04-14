import {
  StaticParamList,
  createStaticNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TransactionDetailView from '../screens/transaction-detail/transaction-detail.view';
import TransactionListView from '../screens/transaction-list/transaction-list.view';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'TransactionList',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    TransactionList: TransactionListView,
    TransactionDetail: TransactionDetailView,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
