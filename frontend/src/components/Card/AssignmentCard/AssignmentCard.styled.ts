import styled from 'styled-components';
import { lighten } from 'polished';

export const DateDataWrapper = styled.div`
    border-top: 1px solid ${props => lighten(0.35, props.theme.colors.reverseSubtle)};
`;
