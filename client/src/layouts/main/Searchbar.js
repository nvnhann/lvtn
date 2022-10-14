import {Icon} from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Button, Input, InputAdornment} from '@material-ui/core';
// components

// ----------------------------------------------------------------------

const SearchbarStyle = styled('div')(({theme}) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

// ----------------------------------------------------------------------

export default function Searchbar() {

    return (
        <div>
            <SearchbarStyle>
                <Input
                    autoFocus
                    fullWidth
                    disableUnderline
                    placeholder="Tìm kiếm…"
                    startAdornment={
                        <InputAdornment position="start">
                            <Box
                                component={Icon}
                                icon={searchFill}
                                sx={{color: 'text.disabled', width: 20, height: 20}}
                            />
                        </InputAdornment>
                    }
                    sx={{mr: 1, fontWeight: 'fontWeightBold'}}
                />
                <Button variant="contained" sx={{width: '9rem'}}>
                    Tìm kiếm
                </Button>
            </SearchbarStyle>
        </div>
    );
}
