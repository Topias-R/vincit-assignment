import React from 'react';
import styled from 'styled-components';
import { DatePicker } from './DatePicker';
import { UTC } from '../utils/UTCDate';

const Container = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, min-content)',
  gridTemplateRows: 'repeat(2, min-content)'
});

const RangeDisplay = styled.div({
  textAlign: 'center',
  gridColumn: '1 / 3'
});

interface DateRangePickerProps {
  startDate: UTC;
  endDate: UTC;
  setStartDate: React.Dispatch<React.SetStateAction<UTC>>;
  setEndDate: React.Dispatch<React.SetStateAction<UTC>>;
}

export function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: DateRangePickerProps): JSX.Element {
  return (
    <Container>
      <DatePicker
        date={startDate}
        setDate={setStartDate}
        isHighlighted={(day) =>
          day.getTime() >= startDate.getTime() &&
          day.getTime() <= endDate.getTime()
        }
        isDisabled={(day) => day.getTime() >= endDate.getTime()}
      />
      <DatePicker
        date={endDate}
        setDate={setEndDate}
        isHighlighted={(day) =>
          day.getTime() <= endDate.getTime() &&
          day.getTime() >= startDate.getTime()
        }
        isDisabled={(day) => day.getTime() <= startDate.getTime()}
      />
      <RangeDisplay>
        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
      </RangeDisplay>
    </Container>
  );
}
