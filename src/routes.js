import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Home from './pages/home';
import LoginPage from './pages/login';

const Routes = createAppContainer(
    createSwitchNavigator({
        LoginPage: {
            screen: LoginPage
        },
        Home: {
            screen: Home
        }
    })
);


export default Routes;