import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 20,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default styles;