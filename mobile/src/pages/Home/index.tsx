import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



interface IbgeUfResponse {
    sigla: string
}

interface IbgeCityResponse {
    nome: string
}


const Home = () => {
    const navigation = useNavigation();

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');



    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf, city
        });
    }


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView>

                <ImageBackground style={styles.container}
                    source={require('../../assets/home-background.png')}
                    imageStyle={{ width: 274, height: 368 }}>
                    <View style={styles.main} >
                        <Image source={require('../../assets/logo.png')} />
                        <Text style={styles.title}>Seu MarketPlace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>
                    <View>
                        <Text style={styles.viewText}>Preencha os campos corretamente para obter os pontos de coleta!</Text>
                    </View>

                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a UF"
                            value={uf}
                            maxLength={2}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            onChangeText={setUf}>
                        </TextInput>

                        <TextInput
                            style={styles.input}
                            placeholder="Digite a Cidade"
                            value={city}
                            autoCorrect={false}
                            onChangeText={setCity}>
                        </TextInput>
                    </View>
                    <View style={styles.footer}>
                        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                            <View style={styles.buttonIcon}>
                                <Text>
                                    <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                                </Text>
                            </View>

                            <Text style={styles.buttonText}>
                                Entrar
                    </Text>
                        </RectButton>

                    </View>

                </ImageBackground >

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: '#f0f0f5',
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    viewText: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
        textAlign: "center",
        color: "#34CB79",
        fontWeight: "bold"
    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        marginVertical: 10
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});


export default Home;