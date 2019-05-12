import { createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import Home from './pages/home';
import HomeUser from './pages/home/homeUser';
import HomeRep from './pages/home/homeRep';
import Login from './pages/login';
import RepForm from './pages/repForm';
import RepCRUD from './pages/repCRUD';
import RepEdit from './pages/repEdit';
import Maps from './pages/maps';
import RepCard from './pages/repCard';
import UserRegist from './pages/userRegist';
import UserProfile from './pages/userProfile';
import Anuncio from './pages/anuncio';

/*
const User = createSwitchNavigator({
 
});

const Rep = createSwitchNavigator({
   
});
*/

const Teste = createBottomTabNavigator({
    Rep : HomeRep,
    User : HomeUser
});

const Routes = createAppContainer(
    createSwitchNavigator({
        Login: Login,
        Home: Teste,
        RepEdit: RepEdit,
        RepForm: RepForm,
        Maps: Maps,
        RepCRUD: RepCRUD,
        UserRegist: UserRegist,
        UserProfile: UserProfile,
        Anuncio: Anuncio,
        RepCard: RepCard,

    }, {
        initialRouteName: 'Login'
    })
    /*
    Codigo antigo
    const Routes = createAppContainer(
        createSwitchNavigator({
            Login: Login,
            Home: Home,
            RepCRUD: RepCRUD,
            RepEdit: RepEdit,
            RepForm: RepForm,
            Maps: Maps,
            RepCard: RepCard,
            UserRegist: UserRegist,
            UserProfile: UserProfile,
            Anuncio: Anuncio
        }, {
            initialRouteName: 'Login'
        })*/
);

export default Routes;