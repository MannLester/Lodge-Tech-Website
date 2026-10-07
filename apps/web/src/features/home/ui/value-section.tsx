"use client";

import Image from "next/image";
import { useState } from "react";
import occupiedRoomImage from "@assets/gem-stat-et/occupied-room.jpeg";
import vacantRoomImage from "@assets/gem-stat-et/vacant-room.png";

export function ValueSection() {
  const [occupied, setOccupied] = useState(true);
  return (
    <section
      aria-labelledby="value-heading"
      className="editorial-section occupancy-section"
      id="value"
    >
      <div className="section-shell">
        <div className="editorial-intro">
          <p className="chapter-label">01 / A more thoughtful building</p>
          <h2 className="display-heading" id="value-heading">
            A room can be empty.
            <br />
            <span className="muted-heading">
              Its energy use shouldn’t carry on.
            </span>
          </h2>
          <p className="editorial-copy">
            Comfort when it matters. Less unnecessary runtime when it doesn’t.
            Our controls respond to how your spaces are actually used.
          </p>
        </div>
        <div className="occupancy-layout">
          <div className="occupancy-photo" data-occupied={occupied}>
            <Image
              alt={
                occupied
                  ? "Illustrative thermostat in an occupied guest room"
                  : ""
              }
              aria-hidden={!occupied}
              className="object-cover object-[center_44%]"
              data-state="occupied"
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 92vw, 60vw"
              src={occupiedRoomImage}
            />
            <Image
              alt={
                occupied ? "" : "Illustrative thermostat in a vacant guest room"
              }
              aria-hidden={occupied}
              className="object-cover object-[center_44%]"
              data-state="vacant"
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 92vw, 60vw"
              src={vacantRoomImage}
            />
            <div className="occupancy-video-brief">
              <span>Video concept / Room control</span>
              <strong>Occupied to vacant.</strong>
              <p>
                Guests choose their comfort while they&apos;re in the room. When
                they leave, occupancy sensing helps the controls follow the
                property&apos;s configured energy-saving settings.
              </p>
            </div>
          </div>
          <div className="occupancy-explainer">
            <p className="chapter-label">Energy follows occupancy</p>
            <div
              aria-label="Illustrative room occupancy"
              className="occupancy-switch"
              role="group"
            >
              <button
                aria-pressed={occupied}
                onClick={() => setOccupied(true)}
                type="button"
              >
                Occupied
              </button>
              <button
                aria-pressed={!occupied}
                onClick={() => setOccupied(false)}
                type="button"
              >
                Vacant
              </button>
            </div>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="occupancy-response"
            >
              <span className="status-label">
                <span aria-hidden className="status-dot" />
                {occupied
                  ? "Comfort is the priority"
                  : "An opportunity to save"}
              </span>
              <h3>
                {occupied ? (
                  <>
                    Welcome in.
                    <br />
                    Feel at home.
                  </>
                ) : (
                  <>
                    Room empty.
                    <br />
                    Waste reduced.
                  </>
                )}
              </h3>
              <p>
                {occupied
                  ? "Room controls support a comfortable stay while occupancy sensing informs the energy-management strategy."
                  : "When a space is vacant, occupancy-based controls can reduce unnecessary HVAC operation within the property’s configured settings."}
              </p>
            </div>
            <p className="small-note">
              Illustrative operation. Settings and equipment compatibility are
              assessed for each property.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
