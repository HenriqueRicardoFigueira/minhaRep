import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Home from './pages/home';
import LoginPage from './pages/login';
import RepForm from './pages/repForm';
import RepCRUD from './pages/repCRUD';
import RepEdit from './pages/repEdit';

const Routes = createAppContainer(
    createSwitchNavigator({
        Login: LoginPage,
        Home: Home,
        RepCRUD: RepCRUD,
        RepEdit: RepEdit,
        RepForm: RepForm,
    }, {
        initialRouteName: 'Login'
    })
);

export default Routes;