import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'urql';
import {ThemeProvider, CSSReset, ColorModeProvider} from '@chakra-ui/react';
import theme from './theme';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Splash from './components/pages/Splash';
import Navbar from './components/layout/Navbar';
import {client} from './config/client';
import {usePostsQuery} from './generated/graphql';
import {useEffect} from 'react';
import Posts from './components/pages/Posts';
import NotFound from './components/pages/NotFound';
import ResetPassword from './components/pages/ResetPassword';

const App = () => {
	const [{data}, getPosts] = usePostsQuery();
	useEffect(() => {
		getPosts();
	}, [data?.posts]);

	return (
		<Provider value={client}>
			<Router>
				<ThemeProvider theme={theme}>
					<ColorModeProvider options={{initialColorMode: 'light'}}>
						<CSSReset />
						<Navbar />
						<Switch>
							<Route exact path='/' component={Splash} />
							<Route exact path='/register' component={Register} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/posts' component={Posts} />
							<Route exact path='/change-password/:resetId' component={ResetPassword} />
							<Route component={NotFound} />
						</Switch>
					</ColorModeProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	);
};

export default App;
