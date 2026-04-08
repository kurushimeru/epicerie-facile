"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/utils/localStorage";
import { stores, type UserAccount } from "@/data/mockData";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();
  const { refreshAccount, setPostalCode } = useAppContext();
  const [account, setAccount] = useState<UserAccount>({
    firstName: "",
    lastName: "",
    postalCode: "",
    storePreferences: [],
    receiveNewsletter: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = storage.getUserAccount();
    if (saved) {
      setAccount(saved);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.firstName || !account.lastName || !account.postalCode) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    storage.setUserAccount(account);
    storage.setPostalCode(account.postalCode);
    setPostalCode(account.postalCode);
    setIsEditing(false);
    refreshAccount();
    toast.success("Compte sauvegardé avec succès !");
  };

  const toggleStore = (storeId: string) => {
    setAccount((prev) => ({
      ...prev,
      storePreferences: prev.storePreferences.includes(storeId)
        ? prev.storePreferences.filter((id) => id !== storeId)
        : [...prev.storePreferences, storeId],
    }));
  };

  const hasAccount = storage.getUserAccount() !== null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{hasAccount && !isEditing ? "Mon compte" : "Créer un compte"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      value={account.firstName}
                      onChange={(e) => setAccount({ ...account, firstName: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      value={account.lastName}
                      onChange={(e) => setAccount({ ...account, lastName: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal <span className="text-red-500">*</span></Label>
                  <Input
                    id="postalCode"
                    value={account.postalCode}
                    onChange={(e) => setAccount({ ...account, postalCode: e.target.value })}
                    disabled={!isEditing}
                    placeholder="H2X 1Y6"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Épiceries préférées</h3>
                <p className="text-sm text-gray-600">
                  Sélectionnez vos épiceries préférées pour recevoir des promotions personnalisées
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stores.map((store) => (
                    <div key={store.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={store.id}
                        checked={account.storePreferences.includes(store.id)}
                        onCheckedChange={() => toggleStore(store.id)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={store.id} className="text-sm cursor-pointer leading-none">
                        {store.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Infolettre</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={account.receiveNewsletter}
                    onCheckedChange={(checked) =>
                      setAccount({ ...account, receiveNewsletter: checked as boolean })
                    }
                    disabled={!isEditing}
                  />
                  <label htmlFor="newsletter" className="text-sm cursor-pointer leading-none">
                    Je veux recevoir les promotions par courriel
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button type="submit" className="flex-1">Sauvegarder</Button>
                    {hasAccount && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const saved = storage.getUserAccount();
                          if (saved) setAccount(saved);
                          setIsEditing(false);
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(true)} className="flex-1">
                      Modifier le compte
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/")}>
                      Retour
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
