import React from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button/Button";
import styled from "styled-components";
import Papa from "papaparse";
import MenuImportOverview from "./MenuImportOverview";
import * as PropTypes from "prop-types";
import {convertImportedMenus} from "../../utils/menuUtil";
import {saveImportedMenusAction, setMenusAction, setShowImportMenuPanelAction} from "../redux/menuActions";
import connect from "react-redux/es/connect/connect";

const InvisibleFileInput = styled.input`
  display: none;
`;

const ClickableLabel = styled.label`
  cursor: pointer;
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
        props.saveImportedMenusAction(props.auth.getAccessToken(), convertedMenus);
    };

    return (
        <div>
            <Button variant="contained" color="default">
                <ClickableLabel>
                    Select File
                    <InvisibleFileInput
                        data-cy={`upload_file`}
                        type="file"
                        onChange={(event) => handleChange(event)}
                    />
                    <CloudUploadIcon/>
                </ClickableLabel>
            </Button>
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
    saveImportedMenusAction: PropTypes.func,
    menu: PropTypes.object
};


const mapStateToProps = (state, ownProps) => ({
    ...state,
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    setMenusAction: (payload) => dispatch(setMenusAction(payload)),
    setShowImportMenuPanelAction: (payload) => dispatch(setShowImportMenuPanelAction(payload)),
    saveImportedMenusAction: (authToken, convertedMenus) => dispatch(saveImportedMenusAction(authToken, convertedMenus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuImport);