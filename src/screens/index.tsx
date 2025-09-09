import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import styled, { useTheme } from 'styled-components/native';
import { requestGalleryPermission } from '../utils/permissions';
import Logger from '../services/LoggerService';
import ImageProcessingService from '../services/ImageService';

const { width } = Dimensions.get('window');

const Screen = () => {
    const theme = useTheme();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isAdjustingImages, setIsAdjustingImages] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleImagePicker = async () => {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
            Alert.alert("Permissão Negada", "Você precisa conceder permissão para acessar a galeria de imagens.");
            return;
        }

        try {
            const images = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                maxFiles: 50,
                selectionLimit: 50,
            });
            const imagePaths = images.map(img => img.path);
            setSelectedImages(imagePaths);
        } catch (e: Error | any) {
            if (e.code !== 'E_PICKER_CANCELLED') {
                Logger.error(e, { message: '[Image Picker] Erro ao selecionar imagens' });
                Alert.alert("Erro", "Não foi possível selecionar as imagens.");
            }
        }
    };

    const handleAdjustSingleImage = async (index: number) => {
        if (isAdjustingImages)
            return;

        const originalUri = selectedImages[index];
        if (!originalUri)
            return;

        setIsAdjustingImages(true);
        try {
            const newUri = await ImageProcessingService.processImage(originalUri);
            if (newUri !== originalUri) {
                const newImages = [...selectedImages];
                newImages[index] = newUri;
                setSelectedImages(newImages);
            }
        } catch (e: Error | any) {
            Logger.error(e, { message: '[Image Processing] Erro ao ajustar imagem única' });
            Alert.alert("Erro", "Ocorreu uma falha ao ajustar a imagem.");
        } finally {
            setIsAdjustingImages(false);
        }
    };

    const handleAdjustAllImages = async () => {
        if (isAdjustingImages)
            return;

        Alert.alert(
            "Ajustar Todas as Imagens",
            "O processamento automático será aplicado em cada imagem, uma por uma. Isso pode levar um momento.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Continuar",
                    onPress: async () => {
                        setIsAdjustingImages(true);
                        try {
                            setProgress(0);
                            const newImageUris = await ImageProcessingService.processImageList(selectedImages, (p) => setProgress(p));
                            setSelectedImages(newImageUris);
                        } catch (e: Error | any) {
                            Logger.error(e, { message: '[Image Processing] Erro ao ajustar todas as imagens' });
                            Alert.alert("Erro", "Ocorreu uma falha durante o processamento das imagens.");
                        } finally {
                            setIsAdjustingImages(false);
                            setProgress(0);
                        }
                    },
                },
            ]
        );
    };

    const handleImageClick = async (uri: string) => {
        if (!uri)
            return;

        try {
            const croppedImage = await ImagePicker.openCropper({
                path: uri,
                mediaType: 'photo',
                cropping: true,
                compressImageMaxWidth: 1000,
                compressImageMaxHeight: 1000,
                compressImageQuality: 0.8,
                forceJpg: true,
            });
            setSelectedImages(prevImages => prevImages.map(img => (img === uri ? croppedImage.path : img)));
        } catch (e: Error | any) {
            if (e.code !== 'E_PICKER_CANCELLED') {
                Logger.error(e, { message: '[Screen] Erro ao recortar imagem existente:' });
                Alert.alert("Erro", "Não foi possível recortar a imagem.");
            }
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        if (isAdjustingImages)
            return;
        setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const renderImageItem = ({ item, index }: { item: string; index: number }) => (
        <ImageItemContainer onPress={() => handleImageClick(item)}>
            <ItemImage source={{ uri: item }} />
            <IconOverlay onPress={() => handleAdjustSingleImage(index)} disabled={isAdjustingImages} style={{ bottom: 5, left: 5 }}>
                <Icon name="crop-outline" size={18} color={theme.colors.white} />
            </IconOverlay>
            <IconOverlay onPress={() => handleRemoveImage(index)} disabled={isAdjustingImages} style={{ top: 5, right: 5 }}>
                <Icon name="close-circle" size={24} color={theme.colors.error} />
            </IconOverlay>
        </ImageItemContainer>
    );

    return (
        <StyledSafeAreaView>
            <Container>
                <FlatList
                    data={selectedImages}
                    renderItem={renderImageItem}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    contentContainerStyle={{ flexGrow: 1, paddingRight: 10 }}
                    ListEmptyComponent={() => (
                        <EmptyContainer>
                            <EmptyText>Nenhuma imagem selecionada</EmptyText>
                        </EmptyContainer>
                    )}
                />
                {isAdjustingImages && (
                    <ProgressContainer>
                        <ProgressBar style={{ width: `${progress * 100}%` }} />
                    </ProgressContainer>
                )}
            </Container>

            {selectedImages.length > 0 && (
                <ActionContainer isBottom isFirst={selectedImages.length > 0}>
                    <FullWidthButton onPress={handleAdjustAllImages} disabled={isAdjustingImages}>
                        <Icon name="crop-outline" size={20} color={theme.colors.white} />
                        <ButtonText>Corrigir Bordas de Todas Imagens</ButtonText>
                    </FullWidthButton>
                </ActionContainer>
            )}

            <ActionContainer isBottom isFirst={selectedImages.length < 1}>
                <FullWidthButton onPress={handleImagePicker} disabled={isAdjustingImages}>
                    <Icon name="image-outline" size={20} color={theme.colors.white} />
                    <ButtonText>Carregar Imagens</ButtonText>
                </FullWidthButton>
            </ActionContainer>
        </StyledSafeAreaView>
    );
};

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const ActionContainer = styled.View<{ isBottom?: boolean, isFirst?: boolean }>`
  padding: 10px;
  padding-top: ${({ isBottom, isFirst }) => (isBottom ? '8px' : '12px')};
  padding-bottom: ${({ isBottom, isFirst }) => (isBottom ? '12px' : '8px')};
  border-top-width: ${({ isBottom, isFirst }) => (isBottom && isFirst ? '1px' : '0px')};
  border-bottom-width: ${({ isBottom, isFirst }) => (isBottom ? '0px' : '1px')};
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const FullWidthButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
`;

const ImageItemContainer = styled.TouchableOpacity`
  width: 100%;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: ${({ theme }) => theme.colors.placeholder};
`;

const ItemImage = styled.Image`
  width: 100%;
  aspect-ratio: 1.777;
  border-radius: 8px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  width: ${width - 20}px;
`;

const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  margin-top: 10px;
`;

const IconOverlay = styled.TouchableOpacity`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.overlay};
  padding: 5px;
  border-radius: 15px;
`;

const ProgressContainer = styled.View`
  height: 4px;
  background-color: ${({ theme }) => theme.colors.progressBarBackground};
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
`;

export default Screen;