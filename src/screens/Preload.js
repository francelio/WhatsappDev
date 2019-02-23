import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { checkLogin } from '../actions/AuthActions';


export class Preload extends Component {

	static navigationOptions = {
		title:'',
		header:null
	}

	constructor(props) {
		super(props);
		this.state = {};

		this.directPages = this.directPages.bind(this);

		this.props.checkLogin();
		// globalizadno o navegation principal
		window.globalNavigator= this.props.navigation;
	}

	directPages() {

		switch(this.props.status) {
			case 1:

				this.props.navigation.dispatch(NavigationActions.reset({
					index:0,
					actions:[
						NavigationActions.navigate({routeName:'Conversas'})
					]
				}));

				break;
			case 2:

				this.props.navigation.dispatch(NavigationActions.reset({
					index:0,
					actions:[
						NavigationActions.navigate({routeName:'Home'})
					]
				}));

				break;
		}

	}
//função nativa executada ao reabriri o aplicativo
	componentDidMount() {
		this.directPages();
	}

//função nativa executada ao atualizar alguma informação na tela
	componentDidUpdate() {
		this.directPages();
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.appName}>DevsApp 1.0</Text>
				<Text>Carregando...</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent:'center',
		alignItems: 'center',
	},
	appName:{
		fontSize:30,
		marginBottom: 20,
	}
});

const mapStateToProps = (state) => {
	return {
		status:state.auth.status
	};
};

const PreloadConnect = connect(mapStateToProps, { checkLogin })(Preload);
export default PreloadConnect;
















