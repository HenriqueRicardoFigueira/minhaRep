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
import MembersList from './pages/membersList';
import MembersAdd from './pages/membersAdd';
import UserRegistAlt from './pages/userRegstAlt';


const Teste = createBottomTabNavigator({
    User : HomeUser,
    Rep : HomeRep,
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
        MembersList: MembersList,
        MembersAdd: MembersAdd,
        UserRegistAlt: UserRegistAlt

    }, {
        initialRouteName: 'UserRegistAlt'
    })
 
);

export default Routes;