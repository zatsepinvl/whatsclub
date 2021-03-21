import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
    async get(key) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        return false;
    }

    async set(key, value) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }

    async remove(key) {
        await AsyncStorage.removeItem(key);
    }
}

export {
    StorageService
}