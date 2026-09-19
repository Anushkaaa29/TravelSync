import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { Camera, Image, Trash } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string | null) => void;
  hasProfileImage: boolean;
};

const ImagePicker = ({
  visible,
  onClose,
  onImageSelected,
  hasProfileImage,
}: Props) => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleImage = (response: ImagePickerResponse) => {
    console.log('Response:', response);
    if (response.didCancel) return;
    if (response.assets?.length) {
      const uri = response.assets[0].uri;
      console.log('Selected URI:', uri);
      if (uri) {
        onImageSelected(uri);
      }
      onClose();
    }
  };

  const openCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      },
      handleImage,
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
      },
      response => {
        if (response.assets?.length) {
          const asset = response.assets[0];
          onImageSelected(`data:${asset.type};base64,${asset.base64}`);
          onClose();
        }
      },
    );
  };

  const removeImage = () => {
    onImageSelected(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.dragHandle} />
            <Text style={styles.title}>Choose image from</Text>
            <Text style={styles.subtitle}>Update your profile picture</Text>
            <View style={styles.gridContainer}>
              <TouchableOpacity style={styles.card} onPress={openGallery}>
                <Image size={28} color="#333" />
                <Text style={styles.cardText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={openCamera}>
                <Camera size={28} color="#333" />
                <Text style={styles.cardText}>Camera</Text>
              </TouchableOpacity>
            </View>

            {hasProfileImage && (
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={removeImage}
              >
                <Trash size={18} color="red" />
                <Text style={styles.removeText}>Remove current image</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },

  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },

  gridContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },

  card: {
    flex: 1,
    backgroundColor: '#F7F7F9',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },

  cardText: {
    marginTop: 8,
    fontSize: 16,
  },

  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },

  removeButton: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD1D1',
  },

  removeText: {
    color: 'red',
    fontWeight: '600',
  },

  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
});
