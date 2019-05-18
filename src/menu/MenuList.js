import {getWeekDay, getWeekNumber} from "../utils/dateUtil";
import * as React from "react";
import styled from "styled-components";
import * as PropTypes from "prop-types";
import {FlexColumnContainer, FlexContainer, FlexGrowContainer} from "../components/container/FlexContainers";

const HeadingContainer = styled(FlexGrowContainer)`
  font-weight: 600;
  padding-bottom: 20px;
`;

const getFilteredMenusByWeek = (weekNumber, menus) => {
    return menus && menus.menus.filter(menu => {
        return getWeekNumber(new Date(menu.date)) === weekNumber;
    });
};

const MenuList = (props) => {
    return (
        <FlexColumnContainer>
            <FlexContainer>
                <HeadingContainer>Wochentag</HeadingContainer>
                <HeadingContainer>Gang 1</HeadingContainer>
                <HeadingContainer>Gang 2</HeadingContainer>
                <HeadingContainer>Gang 3</HeadingContainer>
            </FlexContainer>
            {
                props.menus && getFilteredMenusByWeek(props.weekNumber, props.menus).map((menu, i) => {
                    return (
                        <FlexContainer key={i}>
                            <FlexGrowContainer>{getWeekDay(new Date(menu.date))}</FlexGrowContainer>
                            <FlexGrowContainer data-cy={`week${props.weekNumber}MenuIndex${i}course1`}>{menu.courses[0].description}</FlexGrowContainer>
                            <FlexGrowContainer data-cy={`week${props.weekNumber}MenuIndex${i}course2`}>{menu.courses[1].description}</FlexGrowContainer>
                            <FlexGrowContainer data-cy={`week${props.weekNumber}MenuIndex${i}course3`}>{menu.courses[2].description}</FlexGrowContainer>
                        </FlexContainer>
                    );
                })
            }
        </FlexColumnContainer>
    );
};

export default MenuList;

MenuList.propTypes = {
    weekNumber: PropTypes.number.isRequired,
    menus: PropTypes.object.isRequired,
};