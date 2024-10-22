import { createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import Home from './pages/home';
import HomeUser from './pages/home/homeUser';
import HomeRep from './pages/home/homeRep';
import Login from './pages/login';
import RepForm from './pages/repForm';
import RepCRUD from './pages/repCRUD';
import Maps from './pages/maps';
import RepCard from './pages/repCard';
import UserRegist from './pages/userRegist';
import UserProfile from './pages/userProfile';
import Anuncio from './pages/anuncio';
import MembersList from './pages/membersList';
import MembersAdd from './pages/membersAdd';
import UserRegistAlt from './pages/userRegstAlt';
import Options from './pages/options';
import PhotoGallery from './pages/photoGallery';
import Description from './pages/description';
import Chat from './pages/chat';
import ChatList from './pages/chatList';
import Tags from './components/tags';


const Teste = createBottomTabNavigator({
    User : HomeUser,
    Rep : HomeRep,
});

const Routes = createAppContainer(
    createSwitchNavigator({
        Login: Login,
        Home: Teste,
        RepForm: RepForm,
        RepCRUD: RepCRUD,
        RepCard: RepCard,
        Maps: Maps,
        UserRegist: UserRegist,
        UserProfile: UserProfile,
        UserRegistAlt: UserRegistAlt,
        Anuncio: Anuncio,
        MembersList: MembersList,
        MembersAdd: MembersAdd,
        Options: Options,
        PhotoGallery: PhotoGallery,
        Description: Description,
        Chat: Chat,
        ChatList: ChatList,
        Tags: Tags,
    }, {
        initialRouteName: 'Login'
    })
 
);

export default Routes;