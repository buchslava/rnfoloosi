import React, {useState, useEffect} from 'react';
import {SafeAreaView, Alert, View, Text, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import axios from 'axios';

const {width, height} = Dimensions.get('window');

function App() {
  const [html, setHtml] = useState();

  const onMessage = (e) => {
    const response = JSON.parse(e.nativeEvent.data);
    try {
      if (response.status === 'success') {
        console.log(response.data.transaction_no);
      } else if (response.status === 'error') {
        console.log(response);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
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
      },
    })
      .then((response) => {
        setHtml(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
        <script type="text/javascript" src="https://www.foloosi.com/js/foloosipay.v2.rn.js"></script>
        <script type="text/javascript">
            var options = {
                "reference_token" :"${response.data.data['reference_token']}",
                "merchant_key" : "YOUR_MERCHANT_KEY"
            }
            var fp1 = new Foloosipay(options);
            fp1.open();
            foloosiHandler(response, function (e) {
              if(e.data.status == 'success' || e.data.status == 'error' || e.data.status == 'closed'){
                window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
                window.ReactNativeWebView.postMessage(JSON.stringify(e.data), '*');
              }
          });
        </script>
        </body>
        </html>`);
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }, []);

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1, width, height}}>
      {html ? (
        <WebView
          style={{flex: 1, width, height}}
          originWhitelist={['*']}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          allowUniversalAccessFromFileURLs={true}
          startInLoadingState={true}
          scrollEnabled={true}
          mixedContentMode={'always'}
          onError={(error) => {
            Alert.alert(error.toString());
          }}
          source={{html}}
          onMessage={onMessage}
        />
      ) : (
        <View>
          <Text>loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default App;
