import React from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button/Button";
import styled from "styled-components";
import Papa from "papaparse";
import MenuImportOverview from "./MenuImportOverview";
import * as PropTypes from "prop-types";
import {convertImportedMenus} from "../../utils/menuUtil";
import {setShowImportMenuPanelAction} from "../redux/menuActions";
import connect from "react-redux/es/connect/connect";
import {updateRestaurantMenusAction} from "../../restaurant/redux/restaurantActions";

const InvisibleFileInput = styled.input`
  display: none;
`;

const ClickableLabel = styled.label`
  cursor: pointer;
`;

const StyledImportButton = styled(Button)`
  width: 100%;
  && {
    background-color: white;
  }
`;

const StyledImportButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function MenuImport(props) {
    const [, setCsvFile] = React.useState(undefined);
    const [importedMenus, setImportedMenus] = React.useState(undefined);

    const handleChange = (event) => {
        const file = event && event.target && event.target.files.length > 0 && event.target.files[0];
        setCsvFile(file);
        importCSV(file, event);
    };

    const updateData = (result) => {
        const data = result.data;
        setImportedMenus(data);
        props.setShowImportMenuPanelAction(true);
    };

    const importCSV = (file, event) => {
        event.persist();
        Papa.parse(file, {
            complete: (args) => {
                event.target.value = '';
                updateData(args)
            },
            header: true
        });
    };

    const saveMenus = () => {
        setCsvFile(undefined);
        const convertedMenus = convertImportedMenus(importedMenus);
        props.updateRestaurantMenusAction(convertedMenus, props.restaurantId);
    };
    return (
        <div>
            <StyledImportButton>
                <StyledImportButtonContainer>
                    <ClickableLabel>
                        Select File
                        <InvisibleFileInput
                            data-cy={`upload_file`}
                            type="file"
                            onChange={(event) => handleChange(event)}
                        />
                    </ClickableLabel>
                    <CloudUploadIcon/>
                </StyledImportButtonContainer>
            </StyledImportButton>
            {props.menu.showMenuImportPanel
                ?
                <MenuImportOverview
                    onCancel={() => {
                        setCsvFile(undefined);
                        props.setShowImportMenuPanelAction(false);
                    }}
                    saveMenus={saveMenus}
                    auth={props.auth}
                    menus={importedMenus}
                />
                : undefined
            }
        </div>
    );
}

MenuImport.propTypes = {
    auth: PropTypes.object.isRequired,
    setShowImportMenuPanelAction: PropTypes.func,
    updateRestaurantMenusAction: PropTypes.func,
    menu: PropTypes.object,
    restaurantId: PropTypes.string.isRequired,
};


const mapStateToProps = (state, ownProps) => ({
    ...state,
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    setShowImportMenuPanelAction: (payload) => dispatch(setShowImportMenuPanelAction(payload)),
    updateRestaurantMenusAction: (convertedMenus, restaurantId) => dispatch(updateRestaurantMenusAction(convertedMenus, restaurantId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuImport);