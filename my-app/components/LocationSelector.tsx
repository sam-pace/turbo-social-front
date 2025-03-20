import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useEffect, useState } from "react";
import * as Location from "expo-location";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { YStack, Button, Text, Input } from "tamagui";
import { useTheme } from "context/ThemeContext";
import Fuse from "fuse.js"; // Importando Fuse.js para fuzzy matching
import { LocateFixed } from "@tamagui/lucide-icons";

interface BottomSheetSelectorProps {
    open: boolean;
    setModalOpen: (open: boolean) => void;
    title: string;
    onSelectLocation: (location: any) => void;
}

const BottomSheetSelector = ({
    open,
    setModalOpen,
    title,
    onSelectLocation,
}: BottomSheetSelectorProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["100%"], []);
    const { backgroundColor } = useTheme();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [municipios, setMunicipios] = useState<string[]>([]);
    const [filteredMunicipios, setFilteredMunicipios] = useState<string[]>([]);
    const [ufs, setUfs] = useState<any[]>([]);
    const [filteredUfs, setFilteredUfs] = useState<any[]>([]);
    const [selectedUF, setSelectedUF] = useState<string | null>(null);
    const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
    const [searchTermUF, setSearchTermUF] = useState<string>(""); // Para busca de UF
    const [searchTermMunicipio, setSearchTermMunicipio] = useState<string>(""); // Para busca de Município

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permissão de localização negada");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const reverseGeocode = await Location.reverseGeocodeAsync(
            { latitude: location.coords.latitude, longitude: location.coords.longitude },
            { language: "pt-BR" }
        );

        if (reverseGeocode.length > 0) {
            const { city, region } = reverseGeocode[0];
            setSelectedMunicipio(city);
            setSelectedUF(region);
            onSelectLocation({ municipio: city, uf: region });
        }

        setModalOpen(false);
    };


    const fetchUfs = async () => {
        try {
            const response = await fetch(
                "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
            );
            const data = await response.json();
            setUfs(data);
        } catch (error) {
            setErrorMsg("Erro ao buscar UFs.");
        }
    };

    const fetchMunicipiosByUF = async (uf: string) => {
        try {
            const response = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
            );
            const data = await response.json();
            const municipioNames = data.map((municipio: any) => municipio.nome);
            setMunicipios(municipioNames);
        } catch (error) {
            setErrorMsg("Erro ao buscar municípios.");
        }
    };

    useEffect(() => {
        if (searchTermUF) {
            const fuse = new Fuse(ufs, { keys: ["nome"], threshold: 0.3 });
            const results = fuse.search(searchTermUF).map((result) => result.item);
            setFilteredUfs(results);
        } else {
            setFilteredUfs([]);
        }
    }, [searchTermUF, ufs]);

    useEffect(() => {
        if (searchTermMunicipio && selectedUF) {
            const fuse = new Fuse(municipios, { threshold: 0.3 });
            const results = fuse.search(searchTermMunicipio).map((result) => result.item);
            setFilteredMunicipios(results);
        } else {
            setFilteredMunicipios([]);
        }
    }, [searchTermMunicipio, municipios, selectedUF]);

    useEffect(() => {
        if (open) {
            fetchUfs();
        }
    }, [open]);

    const selectUF = (uf: string) => {
        setSelectedUF(uf);
        setSearchTermUF(uf);
        setFilteredUfs([]);
        fetchMunicipiosByUF(uf);
    };

    const selectMunicipio = (municipio: string) => {
        setSelectedMunicipio(municipio);
        setSearchTermMunicipio(municipio);
        setFilteredMunicipios([]);
        onSelectLocation({ uf: selectedUF, municipio });
        setModalOpen(false);
    };

    if (!open) return null;

    return (
        
        <BottomSheet
            animateOnMount={true}
            enableDynamicSizing={false}
            enablePanDownToClose
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor }}
            onChange={(index) => setModalOpen(index !== -1)}
        >
            
            <BottomSheetView>
                
                    <YStack p={16} gap={20} width="100%" items="center">
                        <Text fontSize={18} fontWeight="bold">{title}</Text>

                        <Button width="90%" onPress={getLocation} icon={LocateFixed} scaleIcon={1.5}>
                            Localização Atual
                        </Button>

                        <Text> Ou</Text>

                        <Input
                            value={searchTermUF}
                            onChangeText={setSearchTermUF}
                            placeholder="Buscar Estado (UF)"
                            width="90%"
                        />

                        {searchTermUF && filteredUfs.length > 0 && (
                            <YStack gap={10} width="90%">
                                {filteredUfs.map((uf) => (
                                    <Button key={uf.sigla} onPress={() => selectUF(uf.sigla)}>
                                        {uf.sigla} - {uf.nome}
                                    </Button>
                                ))}
                            </YStack>
                        )}

                        {selectedUF && (
                            <>
                                <Text>Buscar Município em {selectedUF}:</Text>
                                <Input
                                    value={searchTermMunicipio}
                                    onChangeText={setSearchTermMunicipio}
                                    placeholder="Buscar Município"
                                    width="90%"
                                />

                                {searchTermMunicipio && filteredMunicipios.length > 0 && (
                                    <ScrollView>
                                        <YStack gap={10}>
                                            {filteredMunicipios.map((municipio) => (
                                                <Button
                                                    chromeless
                                                    key={municipio}
                                                    onPress={() => selectMunicipio(municipio)}
                                                >
                                                    {municipio}
                                                </Button>
                                            ))}
                                        </YStack>
                                    </ScrollView>
                                )}
                            </>
                        )}

                        {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}

                        {selectedMunicipio && selectedUF && (
                            <Text>
                                Localização: {selectedMunicipio} - {selectedUF}
                            </Text>
                        )}
                    </YStack>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default BottomSheetSelector;
