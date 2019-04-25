import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Home from './pages/home';
import Login from './pages/login';
import RepForm from './pages/repForm';
import RepCRUD from './pages/repCRUD';
import RepEdit from './pages/repEdit';
import RepCard from './pages/repCard';

const Routes = createAppContainer(
    createSwitchNavigator({
        Login: Login,
        Home: Home,
        RepCRUD: RepCRUD,
        RepEdit: RepEdit,
        RepForm: RepForm,
        RepCard: RepCard
    }, {
        initialRouteName: 'Login'
    })
);

export default Routes;