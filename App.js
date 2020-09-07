import React from 'react';
import {View, Text, SafeAreaView, BackHandler, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import axios from 'axios';

const {width, height} = Dimensions.get('window');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      reference_token: '',
      transaction_no: '',
      merchant_key:
        'YOUR_MERCHANT_KEY',
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
        merchant_key:
          'YOUR_MERCHANT_KEY',
      },
      data: {
        transaction_amount: '100',
        currency: 'AED',
        customer_name: 'foo',
        customer_email: 'foo@foo.com',
        customer_mobile: '+380991112233',
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
        console.log(error);
      });
  };

  onMessage(e) {
    console.log(e.nativeEvent.data);
    const response = JSON.parse(e.nativeEvent.data);
    try {
      if (response.status === 'success') {
        console.log('payment success', response.data.transaction_no);
      } else {
        console.log('payment failed');
      }
    } catch (e) {
      console.log('payment failed', e);
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
    var ref = `https://widget.foloosi.com/?{"reference_token":"${reference_token}","secret_key":"YOUR_MERCHANT_KEY"}`;
    const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <style>
    html,body{height:100%;background:none!important;margin: 0;}.foloosi_wrapper{height:100%;position: fixed;width: 100%;top: 0;display:none;z-index:100000;overflow-y: auto;}.foloosi_show{display:block;}.foloosi_remove.foloosi_show{display:none;}iframe{border:0;border-radius:5px;}#FoloosiPayPluginApiiframe{height:640px;background:#fff;border-radius:5px;margin:0;width:100%;}#foloosi_container {margin: 0 auto; height: 100%;text-align: center;-webkit-transition: .3s ease-out opacity;-o-transition: .3s ease-out opacity;transition: .3s ease-out opacity;z-index: 2;}#foloosi_backdrop { position: absolute;top:0px;left: 0;width: 100%;height: 100%;}#foloosi_container.foloosi_drishy {opacity: 1;white-space:nowrap;}#foloosi_modal { opacity: 1;-webkit-transform: none; -ms-transform: none;transform: none;-webkit-transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;-o-transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform; transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;}#foloosi_modal-inner {-webkit-border-radius: 3px;border-radius: 3px;height: 100%;}.foloosi_close {position: absolute;right:5px;top:20px;cursor: pointer;background:none;border:none;color: #fff;line-height: 25px;font-size:25px;z-index: 1;padding:0;opacity:0.7;-webkit-transform: none;-ms-transform: none;transform: none;-webkit-transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;-o-transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;}.foloosi_close:hover{opacity:1;}#foloosi_options-wrap { position: absolute;top: 50%;-webkit-transform: translateY(-50%);-ms-transform: translateY(-50%);transform: translateY(-50%);left: 12px;right: 12px;z-index: 100;}.foloosi_wrapper.foloosi_show #foloosi_container.foloosi_container #foloosi_modal {opacity: 1;-webkit-transform: none;-ms-transform: none;transform: none;-webkit-transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;-o-transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;transition: .2s,.3s cubic-bezier(.3,1.5,.7,1) transform;}#foloosi_modal { -webkit-border-radius: 3px;border-radius: 3px; -webkit-box-sizing: border-box;box-sizing: border-box;display: inline-block;-webkit-transition: .3s ease-in;-o-transition: .3s ease-in;transition: .3s ease-in;z-index: 1;-webkit-perspective: 300;perspective: 300;position: relative; opacity: 0;-webkit-transform: scale(.9);-ms-transform: scale(.9); transform: scale(.9);color: #333;font-size: 14px;width: 344px;font-family: ubuntu,helvetica,sans-serif;}.foloosi_mchild {vertical-align: middle;display: inline-block; white-space: normal;}.foloosi_wrapper.foloosi_show .foloosi_bgWrapAdd{min-height: 100%; transition: all 0.3s ease-out 0s; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6) none repeat scroll 0% 0%;pointer-events: none;}#foloosi_content{text-align: left;white-space: normal;}.foloosi_wrapper.foloosi_show .foloosi_container:after{content:'';height:96%;display:inline-block;width:0;vertical-align:middle}
    </style>
    <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script type="text/javascript">
    var content = \`
    <div id="foloosi_wrapper" class="foloosi_wrapper foloosi_show">
      <div id="foloosi_bgWrapAdd" class="foloosi_bgWrapAdd"></div>
      <div id="foloosi_container" class="foloosi_container">
        <div id="foloosi_backdrop"></div>
        <div id="foloosi_modal" class="foloosi_mchild">
          <div id="foloosi_modal-inner">
            <div id="foloosi_content">
              <iframe id="FoloosiPayPluginApiiframe" />
            </div>
          </div>
        </div>
      </div>
    </div>\`;
    document.getElementById('root').innerHTML = content;
    setTimeout(function(){
      document.getElementById('FoloosiPayPluginApiiframe').src = '${ref}';
    }, 500);
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var successHandler = window[eventMethod];
    var responseSuccess = eventMethod === "attachEvent" ? "onmessage" : "message";
    var errorHandler = window[eventMethod];
    var responseError = eventMethod === "attachEvent" ? "onmessage" : "message";
    var foloosiHandler = window[eventMethod];
    var response = eventMethod === "attachEvent" ? "onmessage" : "message";
    foloosiHandler(response, function (e) {
      if(e.data.status == 'success' || e.data.status == 'error' || e.data.status == 'closed'){
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
            style={{flex: 1, width: width, height: height}}
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
        ) : (
          <View>
            <Text>loading...</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default App;
