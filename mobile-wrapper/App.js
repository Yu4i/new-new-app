import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView 
        source={{ uri: 'http://192.168.1.77:3000' }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
