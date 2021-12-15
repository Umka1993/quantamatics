import React, { DetailsHTMLAttributes, FunctionComponent, ReactElement, SyntheticEvent, useState } from 'react';
import './style/accordion.scss'
import { useRef } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';

interface AccordionProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: ReactElement | string,
  summaryClass?: string,
  wrapperClass?: string,
}

const Accordion: FunctionComponent<AccordionProps> = ({ summary, className, summaryClass, wrapperClass, open, children, ...other }) => {
  // const [isClosing, setIsClosing] = useState(false);
  const summaryRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDetailsElement>(null);
  const [expendedHeight, setExpendedHeight] = useState('500px');
  const [summaryHeight, setSummaryHeight] = useState('56px');

  useEffect(() => {
    summaryRef.current && setSummaryHeight(`${summaryRef.current.offsetHeight}px`)
  }, [summaryRef.current])

  const ANIMATION_OPTIONS = {
    duration: 200,
    easing: 'ease-out'
  }

  function closeAccordion() {
    if (accordionRef.current) {
      accordionRef.current?.animate({
        height: [expendedHeight, summaryHeight]
      }, ANIMATION_OPTIONS)

      accordionRef.current.open = false;
    }
  }

  function handleSummary(evt: SyntheticEvent<HTMLElement, MouseEvent>) {
    evt.preventDefault();

    const accordion = evt.currentTarget.parentElement as HTMLDetailsElement;

    if (accordion.open) {
      closeAccordion();
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

  useEffect(() => {
    !open && closeAccordion();
  }, [open])

  return (
    <details open={open} className={classNames('accordion', className)} {...other} ref={accordionRef} >
      <summary className={summaryClass} ref={summaryRef} onClick={handleSummary}>{summary}</summary>
      <div className={classNames('accordion__content', wrapperClass)} ref={contentRef}>
        {children}
      </div>
    </details >
  );
}

export default Accordion;