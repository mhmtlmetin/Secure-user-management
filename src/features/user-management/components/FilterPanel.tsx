import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import useDebounce from "../../../hooks/useDebounce";
import { useDispatch } from "react-redux";
import { resetFilters } from "../slices/filterSlice";
import {type FilterState } from "../slices/filterSlice";

// Filtre anahtarlarının tipi
interface FilterParams {
  profession: string | string[];
  name: string;
  tcknPrefix: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterParams, value: any) => void;
}

const professionOptions = ["Yönetici", "Geliştirici", "Tasarımcı", "Analist"];

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const dispatch = useDispatch();

  const [localName, setLocalName] = useState("");
  const [localTckn, setLocalTckn] = useState("");
  const [localProfession, setLocalProfession] = useState("");

  const debouncedName = useDebounce(localName, 500);
  const debouncedTckn = useDebounce(localTckn, 500);

  useEffect(() => {
    onFilterChange("name", debouncedName);
  }, [debouncedName, onFilterChange]);

  useEffect(() => {
    onFilterChange("tcknPrefix", debouncedTckn);
  }, [debouncedTckn, onFilterChange]);

  const handleProfessionChange = (event: any) => {
    setLocalProfession(event.target.value);
    onFilterChange("profession", event.target.value);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalName("");
    setLocalTckn("");
    setLocalProfession("");
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", mb: 3 }}>
      <h3>Kullanıcı Filtreleme</h3>

      {/* Flexbox Container: Filtreleri yatayda tutar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3, // Bileşenler arasındaki boşluk
          alignItems: "center",
          mb: 2, // Altındaki butona boşluk bırak
        }}
      >
        {/* Ad/Soyad Filtresi */}
        <Box sx={{ flexBasis: { xs: "100%", sm: "30%" } }}>
          <TextField
            label="Ad/Soyad"
            variant="outlined"
            fullWidth
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Örn: Ahmet"
          />
        </Box>

        {/* TCKN Önek Filtresi */}
        <Box sx={{ flexBasis: { xs: "100%", sm: "30%" } }}>
          <TextField
            label="TCKN Önek"
            variant="outlined"
            fullWidth
            value={localTckn}
            onChange={(e) => setLocalTckn(e.target.value)}
            placeholder="Örn: 123"
          />
        </Box>

        {/* Meslek Grubu Filtresi */}
        <Box sx={{ flexBasis: { xs: "100%", sm: "30%" } }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Meslek Grubu</InputLabel>
            <Select
              label="Meslek Grubu"
              value={localProfession}
              onChange={handleProfessionChange}
            >
              <MenuItem value="">Hepsi</MenuItem>
              {professionOptions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Filtreleri Sıfırla Butonu */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Filtreleri Sıfırla
        </Button>
      </Box>
    </Box>
  );
};

export default FilterPanel;
