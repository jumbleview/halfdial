/*
 * main.c
 *
 * Created: 4/8/2023 7:35:09 AM
 *  Author: jumbleview
 */ 
#include <xc.h>

#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/sleep.h>
//#define 	F_CPU   1000000UL
//#include <util/delay.h>
#include  <stdbool.h>

typedef enum {OUT_LOW, OUT_HIGH} OutputLevel;

typedef enum {	Mode_NORMAL = 0, Mode_DARK, Mode_SETTIME, Mode_POWEROFF } Mode;

// Pins input/outputs macros definitions

#define pinIn(port,bit) \
((DDR##port &= ~(1 << (DD##port##bit))),\
(PORT##port |= (1 << (PORT##port##bit))),\
(PIN##port & (1 << (PORT##port##bit))))

#define pinInNoPullup(port,bit) \
((DDR##port &= ~(1 << (DD##port##bit))),\
(PORT##port &= ~(1 << (PORT##port##bit))))


#define pinOut(port, bit, outLevel) \
(DDR##port |= (1 << ( DD##port##bit)));\
switch(outLevel) \
{\
	case OUT_LOW: (PORT##port &= ~(1 << (PORT##port##bit))); break;\
	case OUT_HIGH: (PORT##port |= (1 << (PORT##port##bit))); break;\
}


void activateTimer2()
{
	cli();
	ASSR = 0x20;
	TCCR2A=0; // Normal operation
	TCCR2B=1; // external source, no prescaling, 128 interrupts per second for 32768 oscillator
	//TCCR2B=2; // external source, 16 interrupts per second for 32768 oscillator
	//TCCR2B=3; // external source, 4 interrupts per second for 32768 oscillator
	TIMSK2 = 1;
	sei();
}

void AllDark() {
	// B port
	pinInNoPullup(B,1);
	pinInNoPullup(B,2);
	pinInNoPullup(B,3);
	pinInNoPullup(B,4);
	pinInNoPullup(B,5);
	// C port
	pinInNoPullup(C,0);
	pinInNoPullup(C,1);
	pinInNoPullup(C,2);
	pinInNoPullup(C,3);
	pinInNoPullup(C,4);
	pinInNoPullup(C,5);
	// D port
	pinInNoPullup(D,0);
	pinInNoPullup(D,1);
	pinInNoPullup(D,2);
	pinInNoPullup(D,3);
	pinInNoPullup(D,4);		
}

void SecsHoursLights( uint8_t secs, uint8_t hours) {
	// Seconds three-color LED control
	if (secs == 0) {
		pinOut(D,2, OUT_HIGH);
		pinOut(D,3, OUT_HIGH);
		pinOut(D,4, OUT_HIGH);
	} else if ( secs <= 15 ) { // Red
		pinOut(D,2, OUT_LOW);
		pinOut(D,3, OUT_HIGH);
		pinOut(D,4, OUT_HIGH);
	} else if ( secs <= 30 ) { // Green
		pinOut(D,2, OUT_HIGH);		
		pinOut(D,3, OUT_LOW);
		pinOut(D,4, OUT_HIGH);		
	} else if ( secs <= 45 ) { // Blue
		pinOut(D,2, OUT_HIGH);		
		pinOut(D,3, OUT_HIGH);		
		pinOut(D,4, OUT_LOW);
	} else { // White
		pinOut(D,2, OUT_LOW);
		pinOut(D,3, OUT_LOW);
		pinOut(D,4, OUT_LOW);
	}
	
	// Hours LEDs control
	static const uint8_t hoursMask [12] = {0x01,0x03,0x07,0x0F,0x1F,0x3F, 0x40,0x60,0x70,0x78,0x7C,0x7E};
		if (hours >= 12 ) {
			hours = hours - 12;
		}
	uint8_t count = 	hoursMask[hours];
	if (count & 0x01) {
		pinOut(B,5, OUT_LOW);
	} else {
		pinOut(B,5, OUT_HIGH);
	}
	if (count & 0x02) {
		pinOut(B,4, OUT_LOW);
		} else {
		pinOut(B,4, OUT_HIGH);
	}
	if (count & 0x04) {
		pinOut(B,3, OUT_LOW);
		} else {
		pinOut(B,3, OUT_HIGH);
	}
	if (count & 0x08) {
		pinOut(B,2, OUT_LOW);
		} else {
		pinOut(B,2, OUT_HIGH);
	}
	if (count & 0x10) {
		pinOut(B,1, OUT_LOW);
		} else {
		pinOut(B,1, OUT_HIGH);
	}
	if (count & 0x20) {
		pinOut(D,0, OUT_LOW);
		} else {
		pinOut(D,0, OUT_HIGH);
	}
	if (count & 0x40) {
		pinOut(D,1, OUT_LOW);
		} else {
		pinOut(D,1, OUT_HIGH);
	}
}

void MinutesPMlights( uint8_t minutes, uint8_t hours, bool isOdd) {
	
	static const uint8_t fiveMinutesMask [12] = {0x01,0x03,0x07,0x0F,0x1F,0x3F, 0x40,0x60,0x70,0x78,0x7C,0x7E};
	uint8_t fiveMinutes = minutes/5;
	
	
	uint8_t count = 	fiveMinutesMask[fiveMinutes];
	uint8_t lessFiveMinutes = minutes%5;
	static const uint8_t minutesMaskBefore30 [5] = {0x00,0x01,0x03,0x07,0x0F};
	static const uint8_t minutesMaskAfter30 [5] = {0x00,0x08,0x0C,0x0E,0x0F};

	uint8_t minutesCode = 0;
	if (minutes < 30) {
		minutesCode = minutesMaskBefore30[lessFiveMinutes];
	} else {
	  minutesCode = minutesMaskAfter30[lessFiveMinutes];
	}

	if (isOdd) { // Odd
		// 5 minutes LEDs
		if (count & 0x01) { // 0 minute
			pinOut(C,5, OUT_LOW);
		} else {
			pinInNoPullup(C, 5);
		}
		if (count & 0x04) { // 10th minute
			pinOut(C,4, OUT_LOW);
		} else {
			pinInNoPullup(C,4 );
		}
		if (count & 0x10) { // 20th minute
			pinOut(C,3, OUT_LOW);
			} else {
			pinInNoPullup(C,3 );
		}
		if (count & 0x40) { // 30th minute
			pinOut(C,2, OUT_LOW);
			} else {
			pinInNoPullup(C,2 );
		}
		// minutes LEDs
		if (minutesCode & 0x01) { // 1th minute
			pinOut(C,1,OUT_LOW);
		} else {
			pinInNoPullup(C,1);
		}
		if (minutesCode & 0x04) { // 3d minute
			pinOut(C,0,OUT_LOW);
		} else {
			pinInNoPullup(C,0);
		}
	} else { // Even
		// 5 minutes LEDs
		if (count & 0x02) { // 5 minutes
			pinOut(C,5, OUT_HIGH);
		} else {
			pinInNoPullup(C, 5);
		}
		if (count & 0x08) { // 15 minutes
			pinOut(C,4, OUT_HIGH);
		} else {
			pinInNoPullup(C,4 );
		}
		if (count & 0x20) { // 25 minutes
			pinOut(C,3, OUT_HIGH);
		} else {
			pinInNoPullup(C,3 );
		}
		if (hours > 11 ) { // PM
			pinOut(C,2, OUT_HIGH);
		} else {
			pinInNoPullup(C,2 );
		}
		// minutes LEDs
		if (minutesCode & 0x02) { // 2d minute
			pinOut(C,1,OUT_HIGH);
		} else {
			pinInNoPullup(C,1);
		}
		if (minutesCode & 0x08) { // 4th minute
			pinOut(C,0,OUT_HIGH);
		} else {
			pinInNoPullup(C,0);
		}
	}
}

ISR(TIMER2_OVF_vect)
{
	static uint8_t hours = 0;
	static uint8_t minutes = 0;
	static uint8_t secs = 0;
	static uint8_t	clockTick = 0;
	// static uint8_t	modeButtonTick = 0;
	static bool hoursButton = false;
	static bool minutesButton = false;
	static bool modeButton = false;
	static bool powerUp = true;
	static Mode clockMode = Mode_NORMAL;
	
	bool push = (pinIn(D,5) == 0);
 	if (!push) {
		clockMode = Mode_POWEROFF;
	} else if (!powerUp) { // power is up just now
		clockMode = Mode_NORMAL;
	}
	powerUp = push;
	
    push = (pinIn(B,0) == 0);
    if (push) {
	    if (push != modeButton) { // mode button down just now
			if (minutesButton) {
				if (clockMode == Mode_NORMAL) {
					clockMode = Mode_DARK;
				} else if (clockMode == Mode_DARK) {
					clockMode = Mode_NORMAL;
				}	
			} else {
				if (clockMode == Mode_NORMAL) {
					clockMode = Mode_SETTIME;
					secs = 0;
				} else if ( (clockMode == Mode_SETTIME)  || (clockMode == Mode_DARK) ) {
					clockMode = Mode_NORMAL;
				}
			}
		} else { // mode button up nothing to do so far
		}
	}
    modeButton = push;

	
	clockTick++;
	if ( (clockMode != Mode_SETTIME) && ((clockTick & 0x7F) == 0) ) { // Run Clock
		secs++;
		if (secs > 59) {
			secs = 0;
			minutes++;
			if (minutes > 59) {
				minutes = 0;
				hours++;
				if (hours > 23) {
					hours = 0;
				}
			}
		}
	}
	
	push = (pinIn(D,6) == 0);
	
	if (push && (push != hoursButton) && (clockMode == Mode_SETTIME) ) {
		if (minutesButton) { // hours button pressed simultaneously with minutes button. Reset the time.
			hours = 0;
			minutes = 0;
		} else {
			hours++;
			if (hours > 23) {
				hours = 0;
			}
		}
	}
	hoursButton = push;
	
	push = (pinIn(D,7) == 0);
	if (push && (push != minutesButton) && (clockMode == Mode_SETTIME) ) {
		minutes++;
		if (minutes > 59) {
			minutes = 0;
		}
	}
	minutesButton = push;
	if ((clockMode == Mode_DARK) || (clockMode == Mode_POWEROFF) ) {
		AllDark();
	} else {
		SecsHoursLights(secs,hours);
		bool isOdd = (clockTick & 0x01) != 0;
		MinutesPMlights(minutes, hours, isOdd );
	}
}

int main(void)
{
	activateTimer2();
    while(1)
    {
    }
	// set_sleep_mode (SLEEP_MODE_PWR_DOWN);
}