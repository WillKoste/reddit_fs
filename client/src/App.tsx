import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {createClient, Provider} from 'urql'
import {ThemeProvider, CSSReset, ColorModeProvider} from '@chakra-ui/react'
import theme from './theme'
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Splash from './components/pages/Splash';
import Navbar from './components/layout/Navbar';
const client = createClient({url: `https://127.0.0.1:5000/graphql`, fetchOptions: {credentials: 'include'}})

const App = () => {
	return (
		<Provider value={client}>
			<Router>
			<ThemeProvider theme={theme}>
			<ColorModeProvider options={{initialColorMode:"light"}}>
				<CSSReset />
				<Navbar />
					<Switch>
						<Route exact path="/" component={Splash} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
					</Switch>
			</ColorModeProvider>
		</ThemeProvider>
		</Router>
		</Provider>
	);
}

export default App;
