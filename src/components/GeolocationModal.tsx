"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { storage } from "@/utils/localStorage";
import { getUserLocation } from "@/utils/geolocation";
import { toast } from "sonner";

interface GeolocationModalProps {
  onLocationReceived: () => void;
}

export function GeolocationModal({ onLocationReceived }: GeolocationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAsked = storage.getGeolocationAsked();
    const hasLocation = storage.getLocation();
    if (!hasAsked && !hasLocation) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleAccept = async () => {
    try {
      const location = await getUserLocation();
      storage.setLocation(location);
      storage.setGeolocationAsked(true);
      setIsOpen(false);
      toast.success("Position reçue ! On vous montre les promos près de chez vous.");
      onLocationReceived();
    } catch {
      toast.error("Impossible d'obtenir votre position. Entrez votre code postal.");
      storage.setGeolocationAsked(true);
      setIsOpen(false);
    }
  };

  const handleDecline = () => {
    storage.setGeolocationAsked(true);
    setIsOpen(false);
    toast.info("Entrez votre code postal pour voir les promos près de chez vous.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Activer la géolocalisation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Permettez-nous d&apos;accéder à votre position pour vous montrer les meilleures
            promotions dans les épiceries près de chez vous.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleAccept} className="w-full">
              Autoriser la géolocalisation
            </Button>
            <Button onClick={handleDecline} variant="outline" className="w-full">
              Non merci
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Vous pouvez aussi entrer votre code postal dans la barre de recherche
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
