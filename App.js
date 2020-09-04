import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  AppState,
  Platform,
  BackHandler,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import axios from 'axios';

const {height} = Dimensions.get('window');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      reference_token: '',
      transaction_no: '',
      merchant_key: 'YOUR_MERCHANT_KEY',
      paymentResult: 'Pending',
      canGoBack: false,
      check_reference_token: false,
    };
  }

  componentDidMount() {
    this.getReferenceToken();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  getReferenceToken = () => {
    axios({
      method: 'post',
      url: 'https://foloosi.com/api/v1/api/initialize-setup',
      headers: {
        merchant_key: 'YOUR_MERCHANT_KEY',
      },
      data: {
        transaction_amount: '100',
        currency: 'AED',
        customer_name: 'foo',
        customer_email: 'foo@foo.com',
        customer_mobile: '+3809911112233',
        customer_address: 'United Arab Emirates',
        customer_city: 'Abu Dhabi',
      },
    })
      .then((response) => {
        console.log('Token :', response.data.data['reference_token']);
        this.setState(
          {reference_token: response.data.data['reference_token']},
          () => {
            this.setState({check_reference_token: true});
          },
        );
        return response.data.data['reference_token'];
      })
      .catch(function (error) {
        return error;
      });
  };

  onMessage(e) {
    console.log(e.nativeEvent.data);
    const response = JSON.parse(event.nativeEvent.data);
    try {
      if (response.status === 'success') {
        this.setState({transaction_no: response.data.transaction_no}, () => {
          //Here you can process for Successfull transaction
          console.log('payment success');
        });
      } else {
        //Here you can process for Failed transaction
      }
    } catch (e) {
      //error message
    }
  }

  handleBackPress = () => {
    return true;
  };

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  }

  render() {
    const reference_token = this.state.reference_token;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script type="text/javascript" src="https://www.foloosi.com/js/foloosipay.v2.rn.js"></script>
<script type="text/javascript">
    var urlParams = new URLSearchParams(window.location.search);
    var reference_token = urlParams.get('reference_token');
    var options = {
        "reference_token" :"${reference_token}",
        "merchant_key" : "your key"
    }
    var fp1 = new Foloosipay(options);
    fp1.open();
    foloosiHandler(response, function (e) {
        if(e.data.status == 'success'){
          window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
          window.ReactNativeWebView.postMessage(JSON.stringify(e.data), '*');
        }
        if(e.data.status == 'error'){
          window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
          window.ReactNativeWebView.postMessage(JSON.stringify(e.data), '*');
        }
  });
</script>
</body>
</html>`;

    return (
      <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
        {this.state.check_reference_token ? (
          <WebView
            style={{flex: 1, height: height}}
            originWhitelist={['*']}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            useWebKit={true}
            thirdPartyCookiesEnabled={true}
            allowUniversalAccessFromFileURLs={true}
            startInLoadingState={true}
            scrollEnabled={true}
            mixedContentMode={'always'}
            onError={(err) => console.log('Error:', err)}
            source={{html: htmlContent}}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            onMessage={this.onMessage}
          />
        ) : <View><Text>loading...</Text></View>}
      </SafeAreaView>
    );
  }
}

export default App;
