import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { HomesFilters } from "../hooks/useHomes";
import { FilterListRounded as FilterIcon } from "@mui/icons-material";
import { useState } from "react";

interface FiltersProps {
  filters: HomesFilters;
  onUpdate: (filters: HomesFilters) => void;
}

export default function Filters({ filters, onUpdate }: FiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box position="absolute" top={8} right={8}>
        <Fab color="primary" size="small" onClick={() => setOpen(true)}>
          <FilterIcon />
        </Fab>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Filters</DialogTitle>

        <DialogContent>
          <Typography gutterBottom>Price</Typography>
          <Slider
            value={[filters.min_price ?? 0, filters.max_price ?? 2_000_000]}
            onChange={(_, [min_price, max_price]: number[]) =>
              onUpdate({ ...filters, min_price, max_price })
            }
            valueLabelDisplay="auto"
            min={50_000}
            max={3_000_000}
            step={10_000}
          />

          <Stack direction="row">
            <Box flex={1} mr={4}>
              <Typography gutterBottom>Bedrooms</Typography>
              <Slider
                value={[filters.min_bedrooms ?? 0, filters.max_bedrooms ?? 6]}
                onChange={(_, [min_bedrooms, max_bedrooms]: number[]) =>
                  onUpdate({ ...filters, min_bedrooms, max_bedrooms })
                }
                valueLabelDisplay="auto"
                min={1}
                max={6}
                step={1}
                marks
              />
            </Box>

            <Box flex={1}>
              <Typography gutterBottom>Bathrooms</Typography>
              <Slider
                value={[filters.min_bathrooms ?? 0, filters.max_bathrooms ?? 6]}
                onChange={(_, [min_bathrooms, max_bathrooms]: number[]) =>
                  onUpdate({ ...filters, min_bathrooms, max_bathrooms })
                }
                valueLabelDisplay="auto"
                min={1}
                max={6}
                step={0.5}
                marks
              />
            </Box>
          </Stack>

          <Stack direction="row">
            <Box flex={1} mr={4}>
              <Typography gutterBottom>Storeys</Typography>
              <Slider
                value={[filters.min_storeys ?? 0, filters.max_storeys ?? 6]}
                onChange={(_, [min_storeys, max_storeys]: number[]) =>
                  onUpdate({ ...filters, min_storeys, max_storeys })
                }
                valueLabelDisplay="auto"
                min={1}
                max={6}
                step={1}
                marks
              />
            </Box>

            <Box flex={1}>
              <Typography gutterBottom>Land Size (m²)</Typography>
              <Slider
                value={[
                  filters.min_land_size ?? 0,
                  filters.max_land_size ?? 150,
                ]}
                onChange={(_, [min_land_size, max_land_size]: number[]) =>
                  onUpdate({ ...filters, min_land_size, max_land_size })
                }
                valueLabelDisplay="auto"
                min={10}
                max={150}
                step={5}
              />
            </Box>
          </Stack>

          <DialogActions>
            <Button variant="contained" onClick={() => setOpen(false)}>
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
