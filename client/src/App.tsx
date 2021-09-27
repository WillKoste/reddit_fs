import './App.css';
import {ThemeProvider, CSSReset, ColorModeProvider} from '@chakra-ui/react'
import theme from './theme'

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<ColorModeProvider options={{initialColorMode:"light"}}>
				<CSSReset />
				<div>
					<h1>Hey dude!</h1>
				</div>
			</ColorModeProvider>
		</ThemeProvider>
	);
}

export default App;
