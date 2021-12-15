import React, { DetailsHTMLAttributes, FunctionComponent, ReactElement, SyntheticEvent, useState } from 'react';
import classnames from 'classnames';
import './style/accordion.scss'
import { useRef } from 'react';
import { useEffect } from 'react';
import { MouseEventHandler } from 'react';

interface AccordionProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: ReactElement | string,
  summaryClass?: string,
  wrapperClass?: string,
}

const Accordion: FunctionComponent<AccordionProps> = ({ summary, summaryClass, wrapperClass, children, ...other }) => {
  // const [isClosing, setIsClosing] = useState(false);
  const summaryRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expendedHeight, setExpendedHeight] = useState('500px');
  const [summaryHeight, setSummaryHeight] = useState('56px');

  useEffect(() => {
    summaryRef.current && setSummaryHeight(`${summaryRef.current.offsetHeight}px`)
  }, [summaryRef.current])

  const ANIMATION_OPTIONS = {
    duration: 200,
    easing: 'ease-out'
  }

  function handleSummary(evt: SyntheticEvent<HTMLElement, MouseEvent>) {
    evt.preventDefault();

    const accordion = evt.currentTarget.parentElement as HTMLDetailsElement;

    if (accordion.open) {
      accordion.animate({
        height: [expendedHeight, summaryHeight]
      }, ANIMATION_OPTIONS)

      accordion.open = false;
    }
    else {
      accordion.open = true;

      if (contentRef.current && summaryRef.current) {
        const finishHeight = `${contentRef.current.offsetHeight + summaryRef.current.offsetHeight}px`

        accordion.animate({
          height: [summaryHeight, finishHeight]
        }, ANIMATION_OPTIONS)
        setExpendedHeight(finishHeight);
      }
    }
  }

  return (
    <details {...other} className='accordion'>
      <summary className={summaryClass} ref={summaryRef} onClick={handleSummary}>{summary}</summary>
      <div className={classnames('accordion__content', wrapperClass)} ref={contentRef}>
        {children}
      </div>
    </details >
  );
}

export default Accordion;