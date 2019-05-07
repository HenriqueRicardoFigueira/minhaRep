import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from './pages/home';
import Login from './pages/login';
import RepForm from './pages/repForm';
import RepCRUD from './pages/repCRUD';
import RepEdit from './pages/repEdit';
import Maps from './pages/maps';
import RepCard from './pages/repCard';
import UserRegist from './pages/userRegist';
import UserProfile from './pages/userProfile';
import Anuncio from './pages/anuncio';

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
    })
);

export default Routes;